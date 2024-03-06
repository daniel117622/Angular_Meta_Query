// Controller that takes as input the model of StylesAssociation and moves the Styles to the CSS file given by sync

import { StyleAssociation } from "../../models/StyleAssociation";

interface ICommand 
{
    execute() : Promise<void> // Doesnt return, just might fail whether or not it does the source manipulation 
}

export class StylesTransform
{
    private sa_model     ?: StyleAssociation[];
    private thisFile_HTML?: string;
    private outFile_CSS  ?: string;

    constructor() {}

    public setup(sa_model : StyleAssociation[] , thisFile : string , outFile : string)
    {
        this.sa_model = sa_model;
        this.thisFile_HTML = thisFile;
        this.outFile_CSS = outFile;
    }


}