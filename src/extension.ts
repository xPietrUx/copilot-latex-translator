import * as vscode from 'vscode';
import { setupWebviewCommunication } from './communication';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('clt.start', () => {
      // Webview panel
      const panel = vscode.window.createWebviewPanel(
        'clt',
        "Copilot's LaTeX translator",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );

      // HTML content
      panel.webview.html = getWebViewContent();

      // Communication between webview and extension
      setupWebviewCommunication(panel, context);
    })
  );
}

function getWebViewContent() {
  return /*html*/ `
	<!DOCTYPE html>
	<html lang="en">

	<head>
	    <meta charset="UTF-8">
	    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	    <title>Document</title>
	    <style>
	        body {
	            background-color: var(--vscode-editor-background);
	            color: var(--vscode-editor-foreground);
	            font-family: var(--vscode-font-family);
	            padding: 20px;
	        }

	        button {
	            background-color: var(--vscode-button-background);
	            color: var(--vscode-button-foreground);
	            border: none;
	            padding: 6px 14px;
	            border-radius: 2px;
	            cursor: pointer;
	        }

	        button:hover {
	            background-color: var(--vscode-button-hoverBackground);
	        }

	        input {
	            background-color: var(--vscode-input-background);
	            color: var(--vscode-input-foreground);
	            border: 1px solid var(--vscode-input-border);
	            padding: 4px;
	        }

	        textarea {
	            background-color: var(--vscode-input-background);
	            color: var(--vscode-input-foreground);
	            border: 1px solid var(--vscode-input-border);
	            width: 100%;
	            height: 400px;
	            box-sizing: border-box;
	            resize: none;
	        }

	        .container {
	            box-sizing: border-box;
	        }

	        .output {
	            background-color: var(--vscode-editor-background);
	            color: var(--vscode-editor-foreground);
	            box-sizing: border-box;
	        }

			.row {
				margin: 20px 0px 20px 0px;
			}
	    </style>
	</head>

	<body>
	    <div class="container">
	        <div class="row">
	            <button type="button">📋 Paste result</button>
	        </div>
	        <textarea id="paste-area" placeholder='Paste a result of the prompt'></textarea>
	        <div class="row">
	            <button type="button">📟 Translate text</button>
	        </div>
	        <div id="output" class="output"></div>
	    </div>
	</body>

	</html>
  `;
}

export function deactivate() {}
