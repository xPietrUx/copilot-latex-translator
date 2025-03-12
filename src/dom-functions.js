/*
 * The main function initializing DOM operations in webview
 * This function is the entry point for the webview script
 */
function operatingWithDOMs() {
  const vscode = acquireVsCodeApi();

  // Initialize event handlers after document loading
  document.addEventListener('DOMContentLoaded', () => {
    setupButtons(vscode);
    setupMessageHandlers(vscode);
  });
}

/*
 * Sets up buttons in the user interface
 */
function setupButtons() {
  // Configuration of the Translate text button
  const translateButton = document.getElementById('translate-button');
  if (translateButton) {
    translateButton.addEventListener('click', () => {
      vscode.postMessage({ command: 'getClipboard' });
      console.log('Dom func asking for clipboard text');
    });
  }
}

/*
 * Sets up handlers for incoming messages form the extension (communication.ts)
 */
function setupMessageHandlers() {}

/*
 * Sets text in output area
 */
function setOutput(text) {
  const output = document.getElementById('output');
  if (output) {
    try {
      output.innerHTML = text;
    } catch (error) {
      console.error(error);
    }
  }
}
