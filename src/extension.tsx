import * as vscode from "vscode";
import path from "path";
import fs from "fs";
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "es-lint" is now active!');
  const command = vscode.commands.registerCommand('es-lint.showWebview', () => {
    const panel = vscode.window.createWebviewPanel(
      'reactWebview',
      'React Webview',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
      }
    );
    const bundlePath = path.join(
      context.extensionPath,
      "node_modules/react-web-view/build/bundle.js"
    );

    const scriptUri = fs.readFileSync(bundlePath, 'utf8');

    panel.webview.html = getWebviewContent(scriptUri);
  });
  context.subscriptions.push(command);
}
function getWebviewContent(scriptUri: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React App</title>
</head>
<body>
  <div id="root"></div>
  <script>${scriptUri}</script>
</body>
</html>
`;
}

export function deactivate() {}

// const bundlePath = path.join(
//   context.extensionPath,
//   "node_modules/react-web-view/dist/bundle.js"
// );