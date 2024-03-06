import * as vscode from 'vscode';

import { showToast } from './views/toast_test';
import { DataHelper } from './controllers/db/dataHelper';
import { Secrets } from './Secrets';

import { StyleParserCommand } from './controllers/parsing/extract_styles';
import { StyleAssociation } from './models/StyleAssociation';

const testPath = require('path').resolve("C:\\Users\\LENOVO\\Documents\\Trabajo\\sabores2024-expositores\\src\\app\\components\\header\\header.component.html");

export function activate(context: vscode.ExtensionContext) 
{

	let db = new DataHelper(Secrets.getMongoURL());
    
    let command1 = vscode.commands.registerCommand('extension.showToast', () => 
	{
        const sp : StyleParserCommand = new StyleParserCommand(testPath);
        
        sp.execute()
        .then((res : StyleAssociation[]) => 
        {
            showToast(JSON.stringify(res, null, 2));
        })
        .catch(err =>
        {
            console.log(testPath);
            showToast(err.toString());
        });
    });
    

    context.subscriptions.push(command1);
}

export function deactivate() {}
