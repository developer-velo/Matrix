<p align="center">
  <img src=".github/assets/d4cdcdb2-51d3-4106-8888-45baaf5574f3.png#gh-light-mode-only">
  <img src=".github/assets/1870a8b8-e237-404b-be93-e7a7313c79de.png#gh-dark-mode-only">
</p>

# Matrix
---

[Matrix](https://github.com/developer-velo/matrix) - Memory-efficient image to SVG dot-matrix converter.

> ⚠️ **Disclaimer:**
This project is currently in a prototype phase. The logic, file structure,
and API are subject to radical changes at any time. The codebase is far
from perfect, so use it at your own risk.

## Requirements
---

- **Runtime:** [Bun](https://bun.sh) `+1.3.9`
- **Library:** [Cairo](https://cairographics.org) `+1.10.0` (**prebuilt binaries available;** manual build is required on unsupported architectures, see: [node-canvas](https://github.com/Automattic/node-canvas#compiling) for more details)

## Installation
---

1. **Clone repository:** `git clone https://github.com/developer-velo/matrix.git`
2. **Install dependencies:** `bun install`
3. **Build library:** `bun run build`
4. **Link library:** `bun link`
5. **Install Matrix:** `bun link matrix` or `"matrix": "link:matrix"` in your `package.json`

## Usage
---

```ts
import Matrix from "matrix";

const matrix = new Matrix(128);
matrix.convert("input.png", "output.svg");
```

## API Reference
---

### Constructor `Class`

```ts
new Matrix(resolution, options);
```

| Argument     | Type               | Required | Description               |
|--------------|--------------------|----------|---------------------------|
| `resolution` | `Resolution`       | `Yes`    | Target size of the grid.  |
| `options`    | `Partial<Options>` | `No`     | Additional configuration. |

### Convert

```ts
convert(input, output);
```

| Argument | Type     | Required | Description                                        |
|----------|----------|----------|----------------------------------------------------|
| `input`  | `string` | `Yes`    | Path to the source image. (e.g. `input.png`).      |
| `output` | `string` | `Yes`    | Path to the destination file. (e.g. `output.svg`). |

### Resolution

```ts
type Resolution = 16 | 32 | 64 | 128 | 256 | 512;
```

| Definition | Type     | Union                                 |
|------------|----------|---------------------------------------|
| Resolution | `number` | `16`, `32`, `64`, `128`, `256`, `512` |

### Options

```ts
interface Options {
  size: number;
  density: number;
  padding: number;
  threshold: number;
}
```

| Property    | Type     | Default | Description                                |
|-------------|----------|---------|--------------------------------------------|
| `size`      | `number` | `2.0`   | Diameter of a single dot.                  |
| `density`   | `number` | `0.5`   | Spacing multiplier between dots.           |
| `padding`   | `number` | `2.0`   | Internal margin of the output.             |
| `threshold` | `number` | `80.0`  | Alpha channel cutoff for pixel extraction. |

## TODO
---

### Quality
- [ ] **Testing:** Unit tests for full conversion process.
- [ ] **Refactor:** Full transition to strict OOP paradigm.
- [ ] **Documentation:** Comprehensive JSDoc and GitHub Wiki.

### Features
- [ ] **CLI:** Standalone command-line interface.
- [ ] **Web UI:** Interactive playground interface.
- [ ] **Shapes:** Support for various dot types.
- [ ] **Dithering:** Advanced error diffusion algorithms.
- [ ] **I/O Transports:** Support for various data sources.

## License
---

This project is licensed under the **MIT License**.
For more details, please see the [LICENSE.md](LICENSE.md)
