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
          } catch (error) {
            panel.webview.postMessage({
              command: 'error',
              message: 'Cannot read clipboard',
            });
          }
      }
    },
    undefined,
    context.subscriptions
  );
}
