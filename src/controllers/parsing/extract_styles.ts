import { StyleAssociation, StyleObject } from "../../models/StyleAssociation";
import { WorkspaceFolder, workspace } from "vscode";
import * as vscode from 'vscode';

const cheerio = require('cheerio');

interface ICommand 
{
    execute() : Promise<StyleAssociation[]>
}

export class StyleParserCommand implements ICommand
{
    private result? : StyleAssociation[];
    public fileContents?: string;

    constructor() {}

    public execute(): Promise<StyleAssociation[]> 
    {
        return new Promise<StyleAssociation[]>((resolve, reject) => 
        {
            try
            {
                let active_editor : vscode.TextEditor | undefined = vscode.window.activeTextEditor; 
                if (!active_editor) 
                { resolve([]) ; return; }
                if (active_editor)
                {
                    this.fileContents = active_editor.document.getText();
                    let thisFileName = active_editor.document.fileName.split('\\').pop();
                    if (/.*\.component\.html$/.test(thisFileName || '')) 
                    {
                        const $ = cheerio.load(this.fileContents);
                        const stylesAssociations: StyleAssociation[] = [];
                        $('*[style]').each((i : any, elem : any) => {
                            const element = elem.tagName.toLowerCase();
                            const styleContent = $(elem).attr('style');
                            const styleObjects: StyleObject[] = styleContent?.split(';').filter((style: string) => style.trim() !== '').map((style: string) => {
                                const [key, value] = style.split(':').map((s: string) => s.trim());
                                return { key, value };
                            }) || [];
                            stylesAssociations.push({ element, tags: styleObjects });
                        });
                        resolve(stylesAssociations);
                    }
                    else
                    {
                        resolve([]);
                        return;
                    }
                }
            
            } catch(error) { console.error(error) ; resolve([]); }            
        });
    }


}