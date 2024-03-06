import { StyleAssociation, StyleObject } from "../../models/StyleAssociation";
import { promises as fs, read } from 'fs';

interface ICommand 
{
    execute() : Promise<StyleAssociation[]>
}

export class StyleParserCommand implements ICommand
{
    private result? : StyleAssociation[];
    private fileToParse?: string;


    constructor(private filePath: string) 
    {
        this.fileToParse = filePath;
    }

    public execute(): Promise<StyleAssociation[]> 
    {
        return new Promise<StyleAssociation[]>((resolve, reject) => 
        {
            this.read_file(this.fileToParse || 'no file')
                .then(() => {
                    this.result = [
                        { element: "p" , tags: [{ key: "height", value: "5px" }] },
                        { element: "button", tags: [{ key: "color", value: "red" }]}
                    ];
                    resolve(this.result); 
                })
                .catch((error) => {
                    reject(error); // Propagate error to the caller
                });
        });
    }

    private read_file(filePath: string): Promise<void> 
    {
        return new Promise<void>((resolve, reject) =>
        {
            fs.readFile(filePath, { encoding: 'utf-8' })
            .then((data) => 
            {
                this.fileToParse = data;
                resolve();
            })
            .catch((error) => 
            {
                this.fileToParse = '';
                console.error('Failed to read file:', error);
                reject(error); // Propagate error to the caller
            });
        });
    }
}