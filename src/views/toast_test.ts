import * as vscode from 'vscode';

export function showToast() 
{
    vscode.window.showInformationMessage('Hello from Toast Test!');
}