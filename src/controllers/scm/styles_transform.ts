// Controller that takes as input the model of StylesAssociation and moves the Styles to the CSS file given by sync

import * as vscode from 'vscode';

interface ICommand 
{
    execute() : Promise<string> // Returns the string to be appended at component.scss
}

type ClassGrouping = {
    className: string;
    cssProperties: string[];
  };
  
export class StylesTransform implements ICommand
{
    private class_grouping    : ClassGrouping[];
    private thisFile_HTML ?: vscode.Uri;
    private outFile_CSS   ?: vscode.Uri;

    constructor(class_grouping: ClassGrouping[], thisFile: vscode.Uri | null, outFile: vscode.Uri | null)
    {
        this.class_grouping = class_grouping;
        if (thisFile && outFile)
        {
            this.thisFile_HTML = thisFile;
            this.outFile_CSS = outFile;
            console.log({
                class_grouping: this.class_grouping,
                thisFile_HTML: this.thisFile_HTML,
                outFile_CSS: this.outFile_CSS
            });
        }
    }

    execute(): Promise<string> 
    {
        return new Promise((resolve, reject) => 
        {
            if (!this.class_grouping || !this.outFile_CSS) 
            {
                return reject('Class grouping or output file not set up correctly.');
            }
            vscode.workspace.openTextDocument(this.outFile_CSS).then(document => 
            {
                resolve(document.getText());
            }, err => 
            {
                reject(`Failed to open text document: ${err}`);
            });
        });
    }
    
}