type Resolution = 16 | 32 | 64 | 128 | 256 | 512;

interface Model {
  options: Options;
  resolution: Resolution;
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

interface Dimension {
  width: number;
  height: number;
}

const defaultOptions: Options = {
  size: 2.0,
  density: 0.5,
  padding: 2.0,
  threshold: 80.0,
};

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
