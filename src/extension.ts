import * as vscode from 'vscode';
import * as path from 'path';
import { showToast } from './views/toast_test';
import { DataHelper } from './controllers/db/dataHelper';
import { Secrets } from './Secrets';

import { StyleParserCommand } from './controllers/parsing/extract_styles';
import { StyleAssociation } from './models/StyleAssociation';
import { StylesTransform } from './controllers/scm/styles_transform';


export function activate(context: vscode.ExtensionContext) 
{
    /*
	let db = new DataHelper(Secrets.getMongoURL());
    */ 
   
    let command1 = vscode.commands.registerCommand('extension.showToast', () => 
	{
        const sp : StyleParserCommand = new StyleParserCommand();
        sp.execute()
        .then((res : StyleAssociation[]) => 
        {
            
            const all_elements : any = {};
            res.forEach((record) => {
                all_elements[record.element] = [];
                record.tags.forEach((style) => {
                    all_elements[record.element].push(`${style.key}:${style.value}`);
                });
            });
            const invertedDictionary: { [key: string]: string[] } = {};
            for (const tagPosition in all_elements) {
                all_elements[tagPosition].forEach((style : any) => {
                    if (!invertedDictionary[style]) {
                        invertedDictionary[style] = [];
                    }
                    invertedDictionary[style].push(tagPosition);
                });
            }
    
            // Algoritmo desarrollado en Python style_associations.ipynb
            const groupedProperties: { [key: string]: string[] } = {};
            for (const cssProperty in invertedDictionary) {
                invertedDictionary[cssProperty].forEach((element) => {
                    if (!groupedProperties[element]) {
                        groupedProperties[element] = [];
                    }
                    groupedProperties[element].push(cssProperty);
                });
            }
            const cssClasses: { [key: string]: string[] } = {};
            Object.keys(groupedProperties).forEach((element, index) => {
                const className = `class-${index + 1}`;
                cssClasses[className] = groupedProperties[element];
            });

            const propertyToClass: { [key: string]: string[] } = {};
            for (const className in cssClasses) {
                const properties = cssClasses[className].sort().join(';');
                if (!propertyToClass[properties]) {
                    propertyToClass[properties] = [];
                }
                propertyToClass[properties].push(className);
            }

            const mergedClasses: { [key: string]: string[] } = {};
            for (const properties in propertyToClass) { 
                const classNames = propertyToClass[properties];
                if (classNames.length > 1) {
                    mergedClasses[classNames[0]] = properties.split(';');
                } else {
                    mergedClasses[classNames[0]] = properties.split(';');
                }
            }
            const mergedClassesArray = Object.entries(mergedClasses).map(([className, cssProperties]) => ({ className, cssProperties }));
            // Move this object to the the scm object as a parameter 
            
            //This just prints
            
            const currentDocumentUri = vscode.window.activeTextEditor?.document.uri || null;
            const currentFolderUri = currentDocumentUri ? vscode.Uri.file(path.dirname(currentDocumentUri.fsPath)) : null;
            
            if (currentFolderUri) 
            {
                vscode.workspace.findFiles(new vscode.RelativePattern(currentFolderUri, '*.{css,scss}'), undefined, 100)
                    .then(cssFiles => {
                        if (cssFiles.length > 0) 
                        {
                            
                            const cssFileName = cssFiles[0];
                            const scm = new StylesTransform(mergedClassesArray , currentDocumentUri , cssFileName);
                            scm.execute().then((res) => {console.log(res);});
                        }
                    });
            }
        });


    });
    

    context.subscriptions.push(command1);
    
}

export function deactivate() {}
