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
  
    webview(context);
    busApp(context);

    // context.subscriptions.push(CatScratchEditorProvider.register(context));




//By Clicking icon show the button and clicking that button open the custom editor

//     context.subscriptions.push(CatScratchEditorProvider.register(context));

//     // Create and open the custom editor panel when the extension is activated
//     const openEditorCommand = vscode.commands.registerCommand('catScratch.openEditor', async () => {
//     const panel = vscode.window.createWebviewPanel(
//         CatScratchEditorProvider.viewType,
//         'Cat Scratch Editor',
//         vscode.ViewColumn.One,
//         {
//             enableScripts: true
//         }
//     );


//     // Create an empty scratch document
//     const emptyDocument = vscode.workspace.openTextDocument({
//         language: 'json',
//         content: JSON.stringify({ scratches: [] }, null, 2)
//     });

//     // Resolve the custom editor in the created webview panel   
//     const editorProvider = new CatScratchEditorProvider(context);
//     emptyDocument.then(document => {
//         editorProvider.resolveCustomTextEditor(document, panel);
//     });
// });
// context.subscriptions.push(openEditorCommand);

//     // Register the webview view provider for the sidebar
//     context.subscriptions.push(
//         vscode.window.registerWebviewViewProvider('catScratchView', {
//             resolveWebviewView(webviewView) {
//                 webviewView.webview.options = {
//                     enableScripts: true
//                 };
//                 webviewView.webview.html = getWebviewContent();
//                 webviewView.webview.onDidReceiveMessage(message => {
//                     if (message.command === 'openEditor') {
//                         vscode.commands.executeCommand('catScratch.openEditor');
//                     }
//                 });
//             }
//         })
//     );





//By Clicking icon open the custom Editor

    // Register the webview view provider for the sidebar
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('catScratchView', {
            async resolveWebviewView(webviewView) {
                // Create an empty scratch document
                const emptyDocument = await vscode.workspace.openTextDocument({
                    language: 'json',
                    content: JSON.stringify({ scratches: [] }, null, 2)
                });

                // Create and open the custom editor panel
                const panel = vscode.window.createWebviewPanel(
                    CatScratchEditorProvider.viewType,
                    'Cat Scratch Editor',
                    vscode.ViewColumn.One,
                    {
                        enableScripts: true
                    }
                );

                // Resolve the custom editor in the created webview panel
                const editorProvider = new CatScratchEditorProvider(context);
                editorProvider.resolveCustomTextEditor(emptyDocument, panel);
            }
        })
    );

}





// function getWebviewContent(): string {
//     return `
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>Cat Scratch</title>
//         </head>
//         <body>
//         <button id="openEditor">Open Cat Scratch Editor</button>
//         <script>
//             const vscode = acquireVsCodeApi();
//             document.getElementById('openEditor').addEventListener('click', () => {
//                 vscode.postMessage({ command: 'openEditor' });
//             });
//         </script>
//         </body>
//         </html>
//     `;

// }

export function deactivate() {}






