// import * as vscode from 'vscode';
// import * as path from 'path';
// import fs from 'fs';

// export function view1(context: vscode.ExtensionContext) {
 
//     const provider = new MyWebviewViewProvider(context.extensionUri);
//     context.subscriptions.push(vscode.window.registerWebviewViewProvider(MyWebviewViewProvider.viewType, provider));
// }

// class MyWebviewViewProvider implements vscode.WebviewViewProvider {
//     public static readonly viewType = 'extension.myWebview';

//     constructor(
//         private readonly _extensionUri: vscode.Uri
//     ) { }

//     resolveWebviewView() {
//         const panel = vscode.window.createWebviewPanel(
//         MyWebviewViewProvider.viewType,
//         'React app',
//         vscode.ViewColumn.One,
//         {
//             enableScripts: true
//         }
//     );
       
//         panel.webview.html = this.getWebviewContent(panel.webview);
//     }

//     private getWebviewContent(webview: vscode.Webview) {
//                 // const buildPath = path.join(context.extensionPath,'build/bundle.js');
//                 // const scriptUri = panel.webview.asWebviewUri(vscode.Uri.file(buildPath));

//                 // const bundlePath = path.join(this._extensionUri.fsPath,'node_modules/react-app/dist/bundle.js');
//                 const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
//                 const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
               
//                 const bundlePath = path.join(this._extensionUri.fsPath,'node_modules/react-app/dist/bundle.js');
//                 console.log(bundlePath);
//                 const scriptUri = fs.readFileSync(bundlePath, 'utf-8');
      
//         return `
//             <!DOCTYPE html>
//             <html lang="en">
//             <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>Cat Colors</title>
//             <link href="${styleResetUri}" rel="stylesheet">
//             <link href="${styleVSCodeUri}" rel="stylesheet">
//             </head>
//             <body>
//             <div id="root"></div>
//             <script >${scriptUri}</script>
//             </body>
//             </html>`;
//     }
// }




import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function view1(context: vscode.ExtensionContext) {
    // Register the webview view provider
    const provider = new MyWebviewViewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(MyWebviewViewProvider.viewType, provider));

    // Close the sidebar initially
    vscode.commands.executeCommand('workbench.action.closeSidebar');
}

class MyWebviewViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'extension.myWebview';
    private panel: vscode.WebviewPanel | undefined = undefined;

    constructor(private readonly _extensionUri: vscode.Uri) { }

    resolveWebviewView(webviewView: vscode.WebviewView) {
        this.showWebview();
    }

    public showWebview() {
        if (this.panel) {
            // If panel exists, dispose of it to reload
            this.panel.dispose();
        }

        this.panel = vscode.window.createWebviewPanel(
            MyWebviewViewProvider.viewType,
            'React app',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true // Keep the context when hidden
            }
        );

        this.panel.webview.html = this.getWebviewContent(this.panel.webview);

        this.panel.onDidDispose(() => {
            this.panel = undefined;
        });

        // Close the sidebar whenever the panel is shown
        this.panel.onDidChangeViewState(e => {
            if (e.webviewPanel.visible) {
                vscode.commands.executeCommand('workbench.action.closeSidebar');
            }
        });

        // Close the sidebar initially
        vscode.commands.executeCommand('workbench.action.closeSidebar');
    }

    private getWebviewContent(webview: vscode.Webview) {
        const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
        const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));

        const bundlePath = path.join(this._extensionUri.fsPath, 'node_modules/react-app/dist/bundle.js');
        const scriptUri = fs.readFileSync(bundlePath, 'utf-8');

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>React App</title>
            <link href="${styleResetUri}" rel="stylesheet">
            <link href="${styleVSCodeUri}" rel="stylesheet">
            </head>
            <body>
            <div id="root"></div>
            <script>${scriptUri}</script>
            </body>
            </html>`;
    }
}
