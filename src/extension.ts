import * as vscode from 'vscode';

import { showToast } from './views/toast_test';
import { DataHelper } from './controllers/db/dataHelper';
import { Secrets } from './Secrets';



export function activate(context: vscode.ExtensionContext) 
{

	let db = new DataHelper(Secrets.getMongoURL());
    
    let command1 = vscode.commands.registerCommand('extension.showToast', () => 
	{
        console.log(DataHelper.connectedStatus);
        showToast();
    });

    context.subscriptions.push(command1);
}

export function deactivate() {}
