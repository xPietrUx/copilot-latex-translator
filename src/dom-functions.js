/*
 * The main function initializing DOM operations in webview
 * This function is the entry point for the webview script
 */
function operatingWithDOMs() {
  const vscode = acquireVsCodeApi();
  console.log('doms ready');

  // Initialize event handlers after document loading
  document.addEventListener('DOMContentLoaded', () => {
    setupButtons(vscode);
    setupMessageHandlers(vscode);
  });
}

/*
 * Sets up buttons in the user interface
 */
function setupButtons(vscode) {
  // Configuration of the Translate text button
  const translateButton = document.getElementById('translate-button');
  if (translateButton) {
    translateButton.addEventListener('click', () => {
      vscode.postMessage({ command: 'getClipboard' });
    });
  }
}

/*
 * Sets up handlers for incoming messages form the extension (communication.ts)
 */
function setupMessageHandlers(vscode) {
  window.addEventListener('message', (event) => {
    const message = event.data;
    switch (message.command) {
      case 'clipboardData':
        if (message.text) {
          setOutput(message.text);
        } else {
          setOutput('Message not received - empty clipboard?');
        }
        break;

      default:
        console.log('Unknown received command');
        break;
    }
  });
}

/*
 * Sets text in output area
 */
function setOutput(text) {
  const output = document.getElementById('output');
  const descriptionTranslator = document.getElementById(
    'description-translator'
  );
  if (output) {
    try {
      if (descriptionTranslator) {
        descriptionTranslator.style.display = 'none';
      }
      renderMarkdown(text);
    } catch (error) {
      console.error(error);
    }
  }
}

function renderMarkdown(text) {
  const outputElement = document.getElementById('output');
  if (outputElement) {
    // Use Marked library to convert Markdown to HTML
    outputElement.innerHTML = marked.parse(text);

    // Render mathematical expressions
    renderMathInElement(outputElement, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\(', right: '\\)', display: false },
        { left: '\\[', right: '\\]', display: true },
      ],
      throwOnError: false,
    });
  }
}

operatingWithDOMs();
