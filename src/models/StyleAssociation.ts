export interface StyleObject 
{
    key: string; 
    value: string;
}
// Information about which elements have styles applied
export interface StyleAssociation {
    element : string
    tags : StyleObject[];
}