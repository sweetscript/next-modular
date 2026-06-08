# Contributing to Next Modular

Thanks for your interest in contributing. This project is under active development and all contributions are welcome.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/next-modular.git
   cd next-modular
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch for your change:
   ```bash
   git checkout -b feature/your-feature
   ```

## Development Setup

```bash
# Build the core package
npm run build

# Run tests
npm test

# Run the demo app
cd demo/demo-app && npm run dev

# Run the docs site
cd docs && npm run dev
```

## Project Structure

| Directory | Purpose |
|-----------|---------|
| `src/` | Core `next-modular` package |
| `cli/` | CLI commands (init, add, create) |
| `modules/` | Official modules (security, content, etc.) |
| `demo/` | Demo application for testing |
| `docs/` | Documentation site (Next.js + Nextra) |

## How to Contribute

### Reporting Bugs

Open an issue with:
- Steps to reproduce
- Expected vs actual behavior
- Your environment (Node version, OS, Next.js version)

### Suggesting Features

Open a discussion or issue describing:
- The problem you're trying to solve
- Your proposed solution
- Any alternatives you considered

### Submitting Code

1. Make sure tests pass: `npm test`
2. Follow the existing code style
3. Add tests for new functionality
4. Keep commits focused and atomic
5. Write a clear PR description

### Creating a Module

To contribute an official module:

1. Create a new folder under `modules/`:
   ```bash
   mkdir -p modules/your-module/src
   ```
2. Follow the structure of existing modules (see `modules/security-module/` for reference)
3. Include a `README.md` with installation, usage, and configuration docs
4. Add an entry to `docs/data/modules-registry.json`
5. Create an icon SVG at `docs/public/icons/your-module.svg`

### Working on the Docs

The docs site is in `docs/` and uses Next.js with Nextra. Module pages are generated at build time from each module's `README.md`.

```bash
cd docs
npm run dev
```

## Code Style

- TypeScript with strict mode
- Use `const` over `let`, avoid `var`
- camelCase for functions/variables, PascalCase for types/classes
- Prefer explicit types over `any`
- Keep functions small and focused

## Pull Request Process

1. Update documentation if your change affects the public API
2. Ensure CI passes
3. Request a review
4. Squash commits before merge if needed

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
