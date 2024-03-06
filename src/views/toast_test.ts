import * as vscode from 'vscode';
import {DataHelper} from '../controllers/db/dataHelper';

export function showToast(info : string) 
{

    vscode.window.showInformationMessage(info);
}