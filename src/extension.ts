import * as vscode from 'vscode';

import { showToast } from './views/toast_test';
import { DataHelper } from './controllers/db/dataHelper';
import { Secrets } from './Secrets';

import { StyleParserCommand } from './controllers/parsing/extract_styles';
import { StyleAssociation } from './models/StyleAssociation';


export function activate(context: vscode.ExtensionContext) 
{

	let db = new DataHelper(Secrets.getMongoURL());
    
    let command1 = vscode.commands.registerCommand('extension.showToast', () => 
	{
        const sp : StyleParserCommand = new StyleParserCommand();
        
        sp.execute()
        .then((res : StyleAssociation[]) => 
        {
            db.insertStyleAssociations(res) // 
            .then(() => {showToast("Succesfully uploaded styles");})
            .catch((err: Error) => {showToast(err.message);});
            
        });

    });
    

    context.subscriptions.push(command1);
    
}

export function deactivate() {}
