# LÖVE Runner

Run [LÖVE 2D](https://love2d.org) projects directly from VS Code with a single click.

LÖVE Runner is a lightweight Lua game-development workflow for the LÖVE game engine. It packages the current project as a `.love` game archive and launches it from VS Code.

This extension packages your project into a `.love` file and launches it with the installed LÖVE executable, so you can iterate on game logic without leaving the editor.

> **Note:** LÖVE Runner does not run standalone Lua scripts. It only runs LÖVE projects — the play button and `Alt+F5` appear while editing any `.lua` file, but running always packages and launches the whole workspace as a LÖVE project, and requires a `main.lua` at the project root.

## Features

- One-click launch from the editor title bar
- Alt+F5 keybinding while editing Lua files
- Validates that your project has a `main.lua` in the root
- Creates a temporary build folder, packages the game, and cleans up afterward
- Supports a custom LÖVE binary path via configuration

## Who it is for

Use LÖVE Runner when you build 2D games in Lua with LÖVE and want a fast play-test loop inside Visual Studio Code. It works with standard LÖVE projects that have `main.lua` at the project root — it is not a general-purpose Lua interpreter or script runner.

## Quick start

1. Open your LÖVE project in VS Code as the workspace root.
2. Make sure `main.lua` exists at the project root.
3. Click the play button in the editor title bar or use <kbd>Alt+F5</kbd>.
4. The extension will build a temporary `.love` package and run it.

## Requirements

- The [`love`](https://love2d.org) executable must be available on your `PATH`
- On Linux/macOS, `zip` must be installed
- On Windows, PowerShell's `Compress-Archive` is used automatically

## Configuration

Set the path to your LÖVE executable if it is not on `PATH`:

```jsonc
{
  "love.binaryPath": "/usr/bin/love"
}
```

The extension ships with a less aggressive default play shortcut: `Alt+F5`.

You can remap it in VS Code's Keyboard Shortcuts editor by searching for `LÖVE Runner: Run LÖVE Project`, or disable it entirely:

```jsonc
{
  "love.enablePlayKey": false
}
```

| Setting | Default | Description |
| --- | --- | --- |
| `love.binaryPath` | `love` | Full path to the LÖVE executable |
| `love.enablePlayKey` | `true` | Enables the default `Alt+F5` play shortcut for Lua files. Set to `false` to disable it. |

## Support

If you enjoy this extension and want to support its development, you can donate via Ko-fi:

- https://ko-fi.com/baealves

## Development

```sh
npm install
npm run lint
npm run compile
npx @vscode/vsce package --no-dependencies
```

To run the extension in a development window:

```sh
code --extensionDevelopmentPath=/path/to/love-runner
```

## License

CC0 1.0 Universal
