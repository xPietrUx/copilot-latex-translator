/**
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

/**
 * Sets up buttons in the user interface
 */
function setupButtons(vscode) {
  // Configuration of the Paste result button
  const pasteButton = document.getElementById('paste-button');
  if (pasteButton) {
    pasteButton.addEventListener('click', () => {
      vscode.postMessage({ command: 'getClipboard' });
    });
  }

  // Configuration of the Translate text button
  const translateButton = document.getElementById('translate-button');
  if (translateButton) {
    translateButton.addEventListener('click', () => {
      const pasteArea = document.getElementById('paste-area');
      if (pasteArea && pasteArea.value.trim() !== '') {
        setOutputText('Translating...');
        vscode.postMessage({
          command: 'translate',
          text: pasteArea.value,
        });
      } else {
        setOutputText('Please paste some text first');
      }
    });
  }
}

/**
 * Sets up handlers for incoming messages from the extension
 */
function setupMessageHandlers(vscode) {
  window.addEventListener('message', (event) => {
    const message = event.data;

    switch (message.command) {
      case 'clipboardData':
        setPasteAreaText(message.text);
        break;

      case 'translationResult':
        setOutputText(message.text);
        break;

      case 'error':
        showError(message.message);
        break;
    }
  });
}

/**
 * Sets text in the paste area
 */
function setPasteAreaText(text) {
  const pasteArea = document.getElementById('paste-area');
  if (pasteArea) {
    pasteArea.value = text;
  }
}

/**
 * Sets text in the output area
 */
function setOutputText(text) {
  const output = document.getElementById('output');
  if (output) {
    output.textContent = text;
  }
}

/**
 * Displays an error message
 */
function showError(message) {
  setOutputText(`Error: ${message}`);
  const output = document.getElementById('output');
  if (output) {
    output.classList.add('error');
    setTimeout(() => output.classList.remove('error'), 3000);
  }
}

// Call the main function after script loading
operatingWithDOMs();
