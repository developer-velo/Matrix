import type { CanvasRenderingContext2D as Context } from "skia-canvas";
import { Canvas, loadImage, type Image } from "skia-canvas";

import { resolve } from "node:path";
import { readFile, writeFile } from "node:fs/promises";

type Resolution = 16 | 32 | 64 | 128 | 256 | 512;

type RGBAPayload = `rgba(${number},${number},${number},${number})`;
type RGBAStructure = [R: number, G: number, B: number, A: number];

interface Model {
  options: Options;
  resolution: Resolution;
}

interface Surface {
  canvas: Canvas;
  context: Context;
}

interface Options {
  size: number;
  density: number;
  padding: number;
  threshold: number;
}

interface Metrics {
  gap: number;
  radius: number;
  offset: number;
}

interface Pixel {
  color: Color;
  position: Position;
}

interface Color {
  value: RGBAPayload;
  structure: RGBAStructure;
}

interface Dimension {
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

const defaultOptions: Options = {
  size: 2.0,
  density: 0.5,
  padding: 2.0,
  threshold: 80.0,
};

async function readBuffer(location: string): Promise<Buffer> {
  const path = resolve(process.cwd(), location);
  return Buffer.from(await readFile(path, "binary"));
}

async function writeBuffer(location: string, buffer: Buffer): Promise<void> {
  const path = resolve(process.cwd(), location);
  await writeFile(path, buffer.toString(), "binary");
}

class Matrix implements Model {
  public options: Options;
  public resolution: Resolution;

  public constructor(
    resolution: Resolution,
    options: Partial<Options> = defaultOptions,
  ) {
    this.options = { ...defaultOptions, ...options };
    this.resolution = resolution;
  }

  public async convert(input: string, output: string): Promise<void> {
    const { resolution, options } = this;

    const { size, density, padding } = options;
    const metrics = Matrix.metrics(size, density, padding);

    const file = await readBuffer(input);
    const image = await loadImage(file);

    const dimension = Matrix.scale(image, resolution);
    const target = Matrix.rescale(dimension, metrics.gap, padding);

    const pixel = this.extract(image, dimension, metrics);
    const payload = await this.render(target, metrics, pixel);

    await writeBuffer(output, payload);
  }

  private surface(dimension: Dimension): Surface {
    const { width, height } = dimension;

    const canvas = new Canvas(width, height);
    canvas.gpu = true;

    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;

    return { canvas, context };
  }

  private async render(dimension: Dimension, metrics: Metrics, pixel: Generator<Pixel>): Promise<Buffer> {
    const { canvas, context } = this.surface(dimension);

    for (const { position, color } of pixel) {
      const { x, y } = position;
      const { radius } = metrics;

      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI);
      context.closePath();

      context.fillStyle = color.value;
      context.fill();
    }

    return await canvas.toBuffer("svg");
  }

  private * extract(image: Image, dimension: Dimension, metrics: Metrics): Generator<Pixel> {
    const { width, height } = dimension;

    const { context } = this.surface(dimension);
    context.drawImage(image, 0, 0, width, height);

    const data = context.getImageData(0, 0, width, height)["data"];

    for (let position of Matrix.iterator(dimension)) {
      const { threshold } = this.options;

      const color = Matrix.color(data, width, position);
      if (color.structure[3] < threshold) continue;

      const { gap, offset } = metrics;
      position = Matrix.position(position, gap, offset);

      yield { position, color };
    }
  }

  private static * iterator(dimension: Dimension): Generator<Position> {
    const { width, height } = dimension;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        yield { x, y };
      }
    }
  }

  private static color(data: Uint8ClampedArray, width: number, position: Position): Color {
    const { x, y } = position;

    const length = 4;
    const offset = (y * width + x) * length;

    const buffer = data.subarray(offset, offset + length);
    const structure = [...buffer] as RGBAStructure;

    const [R, G, B, A] = structure;
    const value: RGBAPayload = `rgba(${R},${G},${B},${A})`;

    return { value, structure };
  }

  private static position(source: Position, gap: number, offset: number): Position {
    const { x, y } = source;

    const position: Position = {
      x: (x * gap) + offset,
      y: (y * gap) + offset,
    };

    return position;
  }

  private static metrics(size: number, density: number, padding: number): Metrics {
    const gap = size / density;
    const radius = size / 2;
    const offset = radius + padding;

    return { gap, radius, offset };
  }

  private static scale(source: Dimension, resolution: number): Dimension {
    const { width, height } = source;

    const target = resolution;
    const ratio = target / height;

    const dimension: Dimension = {
      width: Math.round(width * ratio),
      height: Math.round(target),
    };

    return dimension;
  }

  private static rescale(source: Dimension, gap: number, padding: number): Dimension {
    const { width, height } = source;

    const dimension: Dimension = {
      width: Math.ceil((width * gap) + (padding * 2)),
      height: Math.ceil((height * gap) + (padding * 2)),
    };

    return dimension;
  }
}

export default Matrix;
