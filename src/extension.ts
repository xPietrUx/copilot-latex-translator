import * as vscode from 'vscode';
import path from 'path';
import fs from 'fs';
import { setupWebviewCommunication } from './communication';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('clt.start', () => {
      const panel = vscode.window.createWebviewPanel(
        'clt',
        "Copilot's LaTeX Translator",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, 'src')),
            vscode.Uri.file(path.join(context.extensionPath, 'dist')),
          ],
        }
      );

      // HTML content
      panel.webview.html = getWebViewContent(panel, context.extensionPath);

      // Communication between webview and extension
      setupWebviewCommunication(panel, context);
    })
  );
}

function getWebViewContent(panel: vscode.WebviewPanel, extensionPath: string) {
  // Generate resource URIs
  const katexJsUri = panel.webview.asWebviewUri(
    vscode.Uri.file(
      path.join(extensionPath, 'dist', 'lib', 'katex', 'katex.min.js')
    )
  );

  const katexCssUri = panel.webview.asWebviewUri(
    vscode.Uri.file(
      path.join(extensionPath, 'dist', 'lib', 'katex', 'katex.min.css')
    )
  );

  const markedJsUri = panel.webview.asWebviewUri(
    vscode.Uri.file(path.join(extensionPath, 'dist', 'lib', 'marked.min.js'))
  );

  const autoKatex = panel.webview.asWebviewUri(
    vscode.Uri.file(
      path.join(
        extensionPath,
        'dist',
        'lib',
        'katex',
        'contrib',
        'auto-render.min.js'
      )
    )
  );

  // Path to dom-functions.js
  const scriptPath = path.join(extensionPath, 'src', 'dom-functions.js');
  let scriptContent = '';

  try {
    scriptContent = fs.readFileSync(scriptPath, 'utf-8');
  } catch (error) {
    console.error(error);
  }

  return /*html*/ `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <!-- KaTeX CSS -->
      <link rel="stylesheet" href="${katexCssUri}">
      <!-- Libs KaTeX and marked.js -->
      <script src="${markedJsUri}"></script>
      <script src="${katexJsUri}"></script>
      <!-- KaTeX auto-render -->
      <script src="${autoKatex}"></script>
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
  
          .output {
              background-color: var(--vscode-editor-background);
              color: var(--vscode-editor-foreground);
              box-sizing: border-box;
              padding: 16px;
              line-height: 1.6;
              font-family: ui-sans-serif, -apple-system, system-ui, Segoe UI, Helvetica, Apple Color Emoji, Arial, sans-serif, Segoe UI Emoji, Segoe UI Symbol;
              overflow: auto;
          }
  
          .output h1,
          .output h2,
          .output h3 {
              padding-bottom: 0.3em;
              margin-top: 1.5em;
              margin-bottom: 0.8em;
          }
  
          .output h1 {
              font-size: 1.8em;
          }
  
          .output h2 {
              font-size: 1.5em;
          }
  
          .output h3 {
              font-size: 1.2em;
          }
  
          .output code {
              font-family: var(--vscode-editor-font-family, monospace);
              background-color: var(--vscode-textCodeBlock-background, rgba(127, 127, 127, 0.1));
              padding: 0.2em 0.4em;
              border-radius: 3px;
              font-size: 0.9em;
          }
  
          .output pre {
              background-color: var(--vscode-textCodeBlock-background, rgba(127, 127, 127, 0.1));
              padding: 16px;
              overflow: auto;
              border-radius: 3px;
              margin: 16px 0;
          }
  
          .output pre code {
              background-color: transparent;
              padding: 0;
              white-space: pre;
          }
  
          .output blockquote {
              color: var(--vscode-tab-unfocusedInactiveForeground);
              border-left: 4px solid var(--vscode-tab-unfocusedActiveBorder);
              padding-left: 16px;
              margin-left: 0;
              font-style: italic;
          }
  
          .output a {
              color: var(--vscode-textLink-foreground);
              text-decoration: none;
          }
  
          .output a:hover {
              text-decoration: underline;
          }
  
          .output table {
              border-collapse: collapse;
              width: 100%;
              margin: 16px 0;
          }
  
          .output table th,
          .output table td {
              border: 1px solid var(--vscode-panel-border);
              padding: 6px 13px;
          }
  
          .output table th {
              background-color: var(--vscode-editor-lineHighlightBackground);
              font-weight: bold;
          }
  
          .output ul,
          .output ol {
              padding-left: 2em;
          }
  
          .output img {
              max-width: 100%;
          }
  
          .container {
              box-sizing: border-box;
          }
  
          .row {
              margin: 20px 0px 20px 0px;
          }

          hr.divider {
              border: none;
              height: 2px;
              background-color: var(--vscode-panel-border);
              margin: 20px 0;
              width: 100%;
          }
      </style>
  </head>
  
  <body>
      <div class="container">
          <h1>Copilot's LaTeX translator</h1>
          <div id="description-translator">
              <h2>1. Copy answer to your question</h2>
              <h2>2. Click button</h2>
              <h2>3. See translated answer</h2>
          </div>
          <div class="row">
              <button id="translate-button" type="button">📟 Translate text</button>
          </div>
          <hr class="divider">
          <div id="output" class="output"></div>
      </div>
  
      <script>
              ${scriptContent}
          operatingWithDOMs();
      </script>
  </body>
  
  </html>
    `;
}

export function deactivate() {}
