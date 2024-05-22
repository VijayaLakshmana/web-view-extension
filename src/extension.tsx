import * as vscode from 'vscode';
import path from 'path';
import fs from 'fs';
import { Webview } from 'vscode';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
// import Welcome from '../node_modules/react-app/src/welcome'
// import Welcome from './welcome';
// import Welcome from 'react-app/src/welcome'
import { webview } from './webView';
import { busApp } from './webApp';
import { CatScratchEditorProvider } from './catScratchEditor';
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "es-lint" is now active!');

    let disposable = vscode.commands.registerCommand('es-lint.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from Es-lint!');
        const panel = vscode.window.createWebviewPanel(
            'htmlPreview',
            'HTML Preview',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'out'))]
            }
        );
        
        // const bundlePath = path.join(context.extensionPath,'node_modules/react-app/out/welcome.js');
        // console.log(bundlePath);
        // const scriptUri = vscode.Uri.file(bundlePath);
        // console.log(scriptUri,"hello");

       
        // const fileContent = ReactDOMServer.renderToString(<Welcome/>);
        // const scriptUri = fs.readFileSync(bundlePath, 'utf-8');
        // console.log(fileContent);
        // panel.webview.html=`<!DOCTYPE html>
        // <html lang="en">
        // <head>
        //     <meta charset="UTF-8">
        //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
        //     <title>My React Component</title>
        // </head>
        // <body>
        //     <div id="root"></div>
        //     <script>
        //         const exports = {};
        //         ${scriptUri}
        //         const Welcome = exports.default;
        //         ReactDOM.render(React.createElement(Welcome), document.getElementById('root'));
        //     </script>
        // </body>
        // </html>`;
        // panel.webview.html=fileContent;
        // panel.webview.html=fileContent;
    //     panel.webview.html = `
    //     <html>
    //     <body>
    //         <div id="root"></div>
    //         <script>${scriptUri}</script>
    //     </body>
    //     </html>
    // `;
    });
    context.subscriptions.push(disposable);

    let disposableHello = vscode.commands.registerCommand('es-lint.hello', () => {
        const panel = vscode.window.createWebviewPanel(
            'myComponentView',
            'My Component',
            vscode.ViewColumn.One,
            {
                enableScripts: true ,
            }
        );
        //bundle.js
        const bundlePath = path.join(context.extensionPath,'node_modules/react-app/dist/bundle.js');
        console.log(bundlePath);
        const scriptUri = fs.readFileSync(bundlePath, 'utf-8');
        panel.webview.html = `
            <html>
            <body>
                <div id="root"></div>
                <script>${scriptUri}</script>
            </body>
            </html>
        `;
    });
    context.subscriptions.push(disposableHello);
    // const myViewProvider = vscode.window.registerWebviewViewProvider('myView', {
    //     resolveWebviewView(webviewView, context, token) {
    //         vscode.commands.executeCommand('es-lint.hello');
    //     }
    // });

    
    // context.subscriptions.push(myViewProvider);

    webview(context);
    busApp(context);

    // context.subscriptions.push(CatScratchEditorProvider.register(context));



    context.subscriptions.push(CatScratchEditorProvider.register(context));

    // Create and open the custom editor panel when the extension is activated
    const panel = vscode.window.createWebviewPanel(
        CatScratchEditorProvider.viewType,
        'Cat Scratch Editor',
        vscode.ViewColumn.One,
        {
            enableScripts: true
        }
    );

    // Create an empty scratch document
    const emptyDocument = vscode.workspace.openTextDocument({
        language: 'json',
        content: JSON.stringify({ scratches: [] }, null, 2)
    });

    // Resolve the custom editor in the created webview panel
    const editorProvider = new CatScratchEditorProvider(context);
    emptyDocument.then(document => {
        editorProvider.resolveCustomTextEditor(document, panel);
    });

    // Register the webview view provider for the sidebar
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('catScratchView', {
            resolveWebviewView(webviewView) {
                webviewView.webview.options = {
                    enableScripts: true
                };
                webviewView.webview.html = getWebviewContent();
            }
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
            <title>Cat Scratch</title>
        </head>
        <body>
            <!-- Add any content you want to display in the sidebar view -->
        </body>
        </html>
    `;

}

export function deactivate() {}






