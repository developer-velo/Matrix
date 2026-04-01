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
}

export default Matrix;
