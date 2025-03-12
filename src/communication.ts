import * as vscode from 'vscode';

// Communication between webview and extension
export function setupWebviewCommunication(
  panel: vscode.WebviewPanel,
  context: vscode.ExtensionContext
) {
  panel.webview.onDidReceiveMessage(
    async (message) => {
      switch (message.command) {
        case 'getClipboard':
          try {
            const text = await vscode.env.clipboard.readText();
            panel.webview.postMessage({ command: 'clipboardData', text });
            console.log('Clipboard data is sent');
          } catch (error) {
            console.error(error);
          }
          break;
      }
    },
    undefined,
    context.subscriptions
  );
}
