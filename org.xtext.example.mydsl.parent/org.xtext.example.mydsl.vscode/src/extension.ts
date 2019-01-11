'use strict';
import { ExtensionContext, StatusBarAlignment, window } from 'vscode';

import { createLanguageClientForEnv } from './language-client';

function showLaunchMessageUntil(onLanguageServerReady: Promise<any>) {
  const statusBarMessage = window.createStatusBarItem(
    StatusBarAlignment.Right,
    100
  );
  statusBarMessage.text = '$(clock) Starting language support';
  statusBarMessage.show();
  onLanguageServerReady.then(() => {
    statusBarMessage.text = '$(check) language support started';
    setTimeout(() => statusBarMessage.dispose(), 3000);
  });
}

export function activate(context: ExtensionContext) {
  const languageClient = createLanguageClientForEnv(context);
  showLaunchMessageUntil(languageClient.onReady());
  context.subscriptions.push(languageClient.start());
}

export function deactivate() {}