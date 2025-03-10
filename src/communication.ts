import * as vscode from 'vscode';

// Communication between webview and extension
export function setupWebviewCommunication(
  panel: vscode.WebviewPanel,
  context: vscode.ExtensionContext
) {
  console.log('[CLT] Setting up webview communication');

  panel.webview.onDidReceiveMessage(
    async (message) => {
      console.log('[CLT] Received message:', message);

      switch (message.command) {
        case 'getClipboard':
          console.log('[CLT] Getting clipboard content');
          try {
            const text = await vscode.env.clipboard.readText();
            console.log('[CLT] Clipboard content length:', text.length);
            console.log(
              '[CLT] Clipboard preview:',
              text.substring(0, 50) + (text.length > 50 ? '...' : '')
            );

            panel.webview.postMessage({ command: 'clipboardData', text });
            console.log('[CLT] Sent clipboard data to webview');
          } catch (error) {
            console.error('[CLT] Error reading clipboard:', error);
            panel.webview.postMessage({
              command: 'error',
              message: 'Cannot read clipboard',
            });
          }
          break;

        case 'translate':
          console.log('[CLT] Translating text');
          panel.webview.postMessage({
            command: 'translationResult',
            text: message.text,
          });
          break;

        default:
          console.log('[CLT] Unknown command:', message.command);
      }
    },
    undefined,
    context.subscriptions
  );

  console.log('[CLT] Webview communication setup complete');
}
