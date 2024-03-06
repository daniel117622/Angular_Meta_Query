import * as vscode from 'vscode';
import {DataHelper} from '../controllers/db/dataHelper';

export function showToast() 
{
    
    vscode.window.showInformationMessage('Connection status: ' + DataHelper.connectedStatus);
}