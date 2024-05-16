import * as vscode from 'vscode';
import path from 'path';
import fs from 'fs';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
// import Welcome from '../node_modules/react-app/src/welcome'
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "es-lint" is now active!');

    let disposable = vscode.commands.registerCommand('es-lint.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from Es-lint!');
        const panel = vscode.window.createWebviewPanel(
            'htmlPreview',
            'HTML Preview',
            vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );
        
        const bundlePath = path.join(context.extensionPath,'node_modules/react-app/out/welcome.js');
        console.log(bundlePath);
        // const scriptUri = vscode.Uri.file(bundlePath);
        // console.log(scriptUri,"hello");
        // const fileContent = ReactDOMServer.renderToString(<Welcome/>);
        const scriptUri = fs.readFileSync(bundlePath, 'utf-8');
        // console.log(fileContent);
        // panel.webview.html=fileContent;
        panel.webview.html = `
        <html>
        <body>
            <div id="root"></div>
            <script>${scriptUri}</script>
        </body>
        </html>
    `;
    });
    context.subscriptions.push(disposable);

    let disposableHello = vscode.commands.registerCommand('es-lint.hello', () => {
        const panel = vscode.window.createWebviewPanel(
            'myComponentView',
            'My Component',
            vscode.ViewColumn.One,
            {
                enableScripts: true 
            }
        );
        const bundlePath = path.join(context.extensionPath,'node_modules/react-app/dist/bundle.js');
        console.log(bundlePath);
        // const scriptUri = vscode.Uri.file(bundlePath);
        // console.log(scriptUri,"hello");
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
}

export function deactivate() {}
