import { StyleAssociation, StyleObject } from "../../models/StyleAssociation";
import { WorkspaceFolder, workspace } from "vscode";
import * as cheerio from 'cheerio';
import * as vscode from 'vscode';
import * as xpath from 'xpath';
import { DOMParser} from 'xmldom';

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
                        const doc = new DOMParser().parseFromString(this.fileContents,'text/html');
                        const nodes = xpath.select("//*[attribute::style]", doc);

                        const stylesAssociations: StyleAssociation[] = [];
                        // This will be changed to something that finds all elements with style tag but also resolves its xpath in the html
                        // Cheerio does not support XPATH
                        (nodes as Node[]).forEach((node: any) => 
                        {
                            const styleContent = node.getAttribute('style');
                            const styleObjects: StyleObject[] = styleContent?.split(';').filter((style: string) => style.trim() !== '').map((style: string) => {
                                const [key, value] = style.split(':').map((s: string) => s.trim());
                                return { key, value };
                            }) || [];

                            const xpathExpr = this.getXPath(node);

                            stylesAssociations.push({ element: xpathExpr , tags : styleObjects });
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

    private getXPath(node: Node): string 
    {
        if (node.nodeType === node.DOCUMENT_NODE) 
        {
            return '';
        }
        const parts: string[] = [];
        let currentNode: Node | null = node;
        while (currentNode && currentNode.nodeType === currentNode.ELEMENT_NODE) 
        {
            let index = 0;
            let sibling: Node | null = currentNode.previousSibling;
            while (sibling) 
            {
                if (sibling.nodeType === currentNode.nodeType && sibling.nodeName === currentNode.nodeName) 
                {
                    index++;
                }
                sibling = sibling.previousSibling;
            }
            const tagName = currentNode.nodeName.toLowerCase();
            const part = (index ? `${tagName}[${index + 1}]` : tagName);
            parts.unshift(part);
            currentNode = currentNode.parentNode; // Move up the DOM tree
        }
        return parts.length ? '/' + parts.join('/') : '';
    }


}