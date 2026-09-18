# LÖVE Runner

A VSCode extension that adds a bright pink play button to run [LÖVE 2D](https://love2d.org) projects with one click.

## What it does

When you press the button (or hit <kbd>F5</kbd> in a Lua file), the extension:

1. Checks that `main.lua` exists in the workspace root (errors if not)
2. Creates a `build/` folder
3. Zips the whole project folder (excluding `build/`)
4. Renames the zip to `game.love`
5. Runs `love game.love`
6. Removes the `build/` folder (even on error)

## Usage

- Open a LÖVE project as your workspace
- Click the pink play button in the editor title bar (on `.lua` files) or in the explorer context menu
- Or press <kbd>F5</kbd> while editing any `.lua` file

## Requirements

- The [`love`](https://love2d.org) executable on your `PATH` (or see configuration below)
- `zip` on Linux/macOS (PowerShell's `Compress-Archive` is used on Windows)

## Configuration

| Setting | Default | Description |
| --- | --- | --- |
| `love.binaryPath` | `love` | Path to the LÖVE executable |

```jsonc
{
  "love.binaryPath": "/usr/bin/love"
}
```

## Install from source

```sh
npm install
npx @vscode/vsce package --no-dependencies
code --install-extension love-runner.vsix
```

Or run it directly:

```sh
code --extensionDevelopmentPath=/path/to/love-runner
```

## License

MIT
