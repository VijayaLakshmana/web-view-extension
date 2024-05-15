// import * as vscode from 'vscode';
// import * as ReactDomServer from 'react-dom/server';
// // import Welcome from 'ReactApp/src/components/welcome'; 
// import Welcome from './welcome';

// function createWebView(context: vscode.ExtensionContext) {
//     context.subscriptions.push(vscode.commands.registerCommand('extension.showReact', () => showHtml(context)));
// }

// async function showHtml(context: vscode.ExtensionContext) {
//     const panel = vscode.window.createWebviewPanel(
//         'htmlPreview',
//         'HTML Preview',
//         vscode.ViewColumn.One,
//         {
//             enableScripts: true
//         }
//     );


//     const fileContent: string = ReactDomServer.renderToString(<Welcome/>);
//     panel.webview.html = fileContent;
// }

// export { createWebView };
