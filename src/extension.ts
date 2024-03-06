import * as vscode from 'vscode';

import { showToast } from './views/toast_test';

export function activate(context: vscode.ExtensionContext) 
{
	
    let command1 = vscode.commands.registerCommand('extension.showToast', () => 
	{
        showToast();
    });

    context.subscriptions.push(command1);
}

export function deactivate() {}
