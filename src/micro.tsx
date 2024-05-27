// import * as vscode from 'vscode';
// import * as fs from 'fs';
// import { spawn } from 'child_process';

// export function micro(context: vscode.ExtensionContext) {
//     let disposableStart = vscode.commands.registerCommand('extension.startRecording', async () => {
//         const fileName = await vscode.window.showInputBox({
//             prompt: 'Enter a file name for recording',
//             placeHolder: 'my_recording.wav'
//         });

//         if (!fileName) return; // User canceled input

//         const filePath = vscode.Uri.joinPath(context.extensionUri, 'recordings', fileName);

//         const outputStream = fs.createWriteStream(filePath.fsPath);

//         const recordingProcess = spawn('arecord', ['-r', '16000', '-f', 'S16_LE', '-c', '1', '-t', 'wav', '-']); // Use arecord command to start recording

//         recordingProcess.stdout.pipe(outputStream); // Pipe the recording process output to the output file

//         vscode.window.showInformationMessage('Recording started.');

//         let disposableStop = vscode.commands.registerCommand('extension.stopRecording', () => {
//             stopRecording(recordingProcess, outputStream);
//             disposableStop.dispose();
//         });

//         context.subscriptions.push(disposableStop);
//     });

//     context.subscriptions.push(disposableStart);
// }

// function stopRecording(recordingProcess: any, outputStream: fs.WriteStream) {
//     recordingProcess.kill(); // Stop the recording process
//     outputStream.end(); // End the output stream
// }




import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';

let recordingProcess: any;
let outputStream: fs.WriteStream;
let panel: vscode.WebviewPanel | undefined;

export function micro(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.showMicrophone', () => {
          panel = vscode.window.createWebviewPanel(
                    'microphoneAccess',
                    'Microphone Access',
                    vscode.ViewColumn.One,
                    {
                        enableScripts: true
                    }
                );

                panel.webview.html = getWebviewContent(false, true);

                panel.webview.onDidReceiveMessage(async (message) => {
                    switch (message.command) {
                        case 'startRecording':
                            await startRecording(context);
                            panel!.webview.html = getWebviewContent(true, false);
                            break;
                        case 'stopRecording':
                            stopRecording();
                            panel!.webview.html = getWebviewContent(false, true);
                            break;
                    }
                });

                panel.onDidDispose(() => {
                    panel = undefined;
                }, null);
            }
        )
    );
}

async function startRecording(context: vscode.ExtensionContext) {
    const fileName = await vscode.window.showInputBox({
        prompt: 'Enter a file name for recording',
        placeHolder: 'my_recording.wav'
    });

    if (!fileName) return; // User canceled input

    const recordingsDir = path.join(context.extensionPath, 'recordings');
    if (!fs.existsSync(recordingsDir)) {
        fs.mkdirSync(recordingsDir);
    }

    const filePath = path.join(recordingsDir, fileName);

    outputStream = fs.createWriteStream(filePath);

    recordingProcess = spawn('arecord', ['-r', '16000', '-f', 'S16_LE', '-c', '1', '-t', 'wav', '-']); // Use arecord command to start recording

    recordingProcess.stdout.pipe(outputStream); // Pipe the recording process output to the output file

    recordingProcess.on('error', (error: any) => {
        vscode.window.showErrorMessage(`Recording process error: ${error.message}`);
    });

    recordingProcess.on('exit', (code: number, signal: string) => {
        vscode.window.showInformationMessage(`Recording process exited with code ${code} and signal ${signal}`);
    });

    vscode.window.showInformationMessage('Recording started.');
}

function stopRecording() {
    if (!recordingProcess) {
        vscode.window.showInformationMessage('No recording in progress.');
        return;
    }

    recordingProcess.kill(); // Stop the recording process
    outputStream.end(); // End the output stream
    recordingProcess = null;
    vscode.window.showInformationMessage('Recording stopped.');
}

function getWebviewContent(startDisabled: boolean, stopDisabled: boolean) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Microphone Access</title>
        </head>
        <body>
            <h1>Microphone Access</h1>
            <button id="startButton" ${startDisabled ? 'disabled' : ''} onclick="startRecording()">Start Recording</button>
            <button id="stopButton" ${stopDisabled ? 'disabled' : ''} onclick="stopRecording()">Stop Recording</button>

            <script>
                const vscode = acquireVsCodeApi();

                function startRecording() {
                    vscode.postMessage({ command: 'startRecording' });
                    document.getElementById('startButton').disabled = true;
                    document.getElementById('stopButton').disabled = false;
                }

                function stopRecording() {
                    vscode.postMessage({ command: 'stopRecording' });
                    document.getElementById('startButton').disabled = false;
                    document.getElementById('stopButton').disabled = true;
                }
            </script>
        </body>
        </html>
    `;
}


