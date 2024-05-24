import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function reactApp(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "bus app" is now active!');

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.openApp', () => {
            const panel = vscode.window.createWebviewPanel(
                'app',
                'web App',
                vscode.ViewColumn.One,
                {
                    enableScripts: true ,
                    localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath,'node_modules', 'web-app', 'build'))]
                }
            );

            const editorProvider = new CustomEditorProvider(context);
            editorProvider.resolveCustomTextEditor(undefined, panel);
        })
    );
}

class CustomEditorProvider implements vscode.CustomTextEditorProvider {
   

    private static readonly viewType = 'yourExtension.customEditor';

    constructor(
        private readonly context: vscode.ExtensionContext
    ) {}

    public async resolveCustomTextEditor(document: vscode.TextDocument| undefined, webviewPanel: vscode.WebviewPanel): Promise<void> {
        const buildPath = path.join(this.context.extensionPath, 'node_modules', 'web-app', 'build');
        const indexPath = path.join(buildPath, 'index.html');

        if (!fs.existsSync(indexPath)) {
            vscode.window.showErrorMessage('index.html not found!');
            return;
        }

        let html = fs.readFileSync(indexPath, 'utf8');

        // html = html.replace(/(href|src)="([^"]+)"/g, (fullMatch, p1, p2) => {
        //     const resourcePath = vscode.Uri.file(path.join(buildPath, p2));
        //     const webviewUri = webviewPanel.webview.asWebviewUri(resourcePath);
        //     console.log(`Mapping resource: ${p2} to ${webviewUri}`);
        //     return `${p1}="${webviewUri}"`;
        // });

        console.log('Final HTML content:', html);

        webviewPanel.webview.html = html;
    }
}
