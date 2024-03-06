import { StyleAssociation, StyleObject } from "../../models/StyleAssociation";
import { WorkspaceFolder, workspace } from "vscode";
import * as path from 'path';
import * as fs from 'fs';

interface ICommand 
{
    execute() : Promise<StyleAssociation[]>
}

export class StyleParserCommand implements ICommand
{
    private result? : StyleAssociation[];
    private fileToParse?: string;
    private fileContents?: string;

    constructor(private filePath: string) 
    {
        this.fileToParse = filePath;
    }

    public execute(): Promise<StyleAssociation[]> 
    {
        return new Promise<StyleAssociation[]>((resolve, reject) => 
        {
            let active_folder: WorkspaceFolder | undefined = workspace.workspaceFolders ? workspace.workspaceFolders[0] : undefined;
            if (active_folder)
            {
                let resolvedPath = path.resolve(active_folder.uri.fsPath);
                this.read_file(resolvedPath || 'no file')
                .then(() => 
                {
                    let text_file : string;
                    if (!fs.existsSync(resolvedPath)) { this.result = []; }
                    else
                    {
                        const files = fs.readdirSync(resolvedPath);
                        const filter = /\.component\.html$/; 
                        const file = files.find(file => filter.test(file)); 
                        // Found a component    
                        if (file) 
                        {
                            const fullPath = path.join(resolvedPath, file);
                            const text_file = fs.readFileSync(fullPath, 'utf8');
                            console.log(`Content of ${file}:`, text_file);
                        }
                    }
                    
                })
                .catch((error) => {
                    reject(error); // Propagate error to the caller
                });
            }
            
        });
    }

    private read_file(filePath: string): Promise<string> 
    {
        return new Promise<string>((resolve, reject) => 
        {
            fs.readFile(filePath, { encoding: 'utf-8' }, (error, data) => 
            {
                if (error) {
                    this.fileToParse = '';
                    console.error('Failed to read file:', error);
                    reject(error); 
                } else {
                    this.fileContents = data;
                    resolve(data); 
                }
            });
        });
    }
}