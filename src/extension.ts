import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as path from 'path';
import { exec, execFile } from 'child_process';
import { promisify } from 'util';
import { buildLoveInvocation } from './loveInvocation';

const execAsync = promisify(exec);
const execFileAsync = promisify(execFile);

const BUILD_DIR = 'build';
const ZIP_NAME = 'game.zip';
const LOVE_NAME = 'game.love';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('love.run', async () => {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0) {
      vscode.window.showErrorMessage('LÖVE: No workspace folder is open.');
      return;
    }
    const projectRoot = folders[0].uri.fsPath;
    await runLoveProject(projectRoot);
  });

  context.subscriptions.push(disposable);
}

async function runLoveProject(projectRoot: string): Promise<void> {
  // 1. Check that main.lua exists
  const mainLua = path.join(projectRoot, 'main.lua');
  try {
    await fs.access(mainLua);
  } catch {
    vscode.window.showErrorMessage(
      `LÖVE: main.lua not found in project root (${projectRoot}). Cannot run.`
    );
    return;
  }

  // 2. Create build folder
  const buildDir = path.join(projectRoot, BUILD_DIR);
  const zipPath = path.join(buildDir, ZIP_NAME);
  const lovePath = path.join(buildDir, LOVE_NAME);

  try {
    await fs.rm(buildDir, { recursive: true, force: true });
    await fs.mkdir(buildDir, { recursive: true });

    // 3. Zip the whole project folder
    await zipProject(projectRoot, zipPath);

    // 4. Rename the extension to .love
    await fs.rename(zipPath, lovePath);

    // 5. Run love 'game'.love
    const loveBinary = vscode.workspace
      .getConfiguration('love')
      .get<string>('binaryPath') || 'love';
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `LÖVE: running ${LOVE_NAME}...`,
        cancellable: false,
      },
      () => {
        const { command, args } = buildLoveInvocation(loveBinary, lovePath);
        return execFileAsync(command, args, { cwd: buildDir });
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    vscode.window.showErrorMessage(`LÖVE: ${message}`);
    return;
  } finally {
    // 6. rm -rf the build folder
    await fs.rm(buildDir, { recursive: true, force: true }).catch(() => {});
  }
}

async function zipProject(projectRoot: string, zipPath: string): Promise<void> {
  if (process.platform === 'win32') {
    // PowerShell: zip everything except the build folder itself
    const ps = `Compress-Archive -Path (Get-ChildItem -Path . -Exclude build | Select-Object -ExpandProperty FullName) -DestinationPath "${zipPath}" -Force`;
    const { stderr } = await execAsync(
      `powershell -NoProfile -Command "${ps.replace(/"/g, '\\"')}"`,
      { cwd: projectRoot }
    );
    if (stderr) {
      throw new Error(stderr);
    }
  } else {
    // zip -r: recursive, -X: no extra file attributes
    const { stderr } = await execAsync(
      `zip -r -X "${zipPath}" . -x "${BUILD_DIR}/*"`,
      { cwd: projectRoot }
    );
    if (stderr) {
      throw new Error(stderr);
    }
  }
}

export function deactivate() {}
