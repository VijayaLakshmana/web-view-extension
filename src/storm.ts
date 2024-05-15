import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "es-lint" is now active!');

    let disposable = vscode.commands.registerCommand('es-lint.hello', () => {
        vscode.window.showInformationMessage('Hello World from Es-lint!');
        
        // Create a webview panel
        const panel = vscode.window.createWebviewPanel(
            'myComponentView',
            'My Component',
            vscode.ViewColumn.One,
            {}
        );

        // Load the bundle.js file into the webview
        const scriptPathOnDisk = vscode.Uri.file(
            vscode.workspace.workspaceFolders![0].uri.fsPath + '/web/bundle.js'
        );

        const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });

        panel.webview.html = `
            <html>
            <body>
                <div id="root"></div>
                <script src="${scriptUri}"></script>
            </body>
            </html>
        `;
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
