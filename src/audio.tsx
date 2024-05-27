import * as vscode from 'vscode';


// function getWebviewContent(context: vscode.ExtensionContext, audioFilePath: string): string {
//     const htmlPath = path.join(context.extensionPath, 'media', 'audioPlayer.html');
//     let htmlContent = fs.readFileSync(htmlPath, 'utf8');

//     const audioFileUri = vscode.Uri.file(audioFilePath).with({ scheme: 'vscode-resource' });
//     console.log('Resolved audio file URI:', audioFileUri.toString()); 

//     // Inject the audio file URI into the HTML content
//     htmlContent = htmlContent.replace('AUDIO_URL', audioFileUri.toString());

//     return htmlContent;
// }

export function audio(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.showAudioPlayer', () => {
        const panel = vscode.window.createWebviewPanel(
            'audioPlayer',
            'Audio Player',
            vscode.ViewColumn.One,
            { 
                enableScripts: true,
                localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
            }
        );

        const audioFilePath = vscode.Uri.joinPath(context.extensionUri, 'media', '100-KB-MP3.mp3');
        const audioFileUri = panel.webview.asWebviewUri(audioFilePath);
        console.log(audioFileUri);
        panel.webview.html = getWebviewContent(audioFileUri);
    }));
}

function getWebviewContent(audioFileUri: vscode.Uri) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Audio Player</title>
</head>
<body>
    <audio id="audioPlayer" controls>
        <source src="${audioFileUri}" type="audio/mpeg">
        Your browser does not support the audio element.
    </audio>
</body>
</html>`;
}





// export function audio(context: vscode.ExtensionContext) {
//     context.subscriptions.push(vscode.commands.registerCommand('extension.showAudioPlayer', () => {
//         const panel = vscode.window.createWebviewPanel(
//             'audioPlayer',
//             'Audio Player',
//             vscode.ViewColumn.One,
//             { enableScripts: true }
//         );

//         const htmlPath = path.join(context.extensionPath, 'media', 'audioPlayer.html');
//         const htmlContent = fs.readFileSync(htmlPath, 'utf8');
//         panel.webview.html = htmlContent;
//     }));



// }


