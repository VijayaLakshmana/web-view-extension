import * as vscode from 'vscode';

export function webview(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "bus-app" is now active!');

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.openBusApp', () => {
            const panel = vscode.window.createWebviewPanel(
                'busapp',
                'Bus App',
                vscode.ViewColumn.One,
                {
                    enableScripts: true
                }
            );

            panel.webview.html = getWebviewContent();
        })
    );
}

function getWebviewContent(): string {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bus app</title>
            <style>
                body {
                    background-color: white;
                }
            </style>
        </head>
        <body>
            <iframe src="http://localhost:3000/" width="1300" height="700" frameborder="0"></iframe>
        </body>
        </html>
    `;
}


