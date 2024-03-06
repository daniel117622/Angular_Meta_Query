import { Document, MongoClient } from 'mongodb';
import { StyleAssociation } from '../../models/StyleAssociation';
import { createHash } from 'crypto';

export class DataHelper
{    
    
    public static connectedStatus: boolean = false;
    private client: MongoClient;  
    
    constructor(env_uri : string) 
    {
      this.client = new MongoClient(env_uri);
      this.connect();
    }

    private connect(): void 
    {
      this.client.connect().then(() => {
          console.log('Connected to the MongoDB database successfully');
          DataHelper.connectedStatus = true;
      }).catch((error) => {
          console.error('Failed to connect to the database:', error);
      });
    }

    public insertStyleAssociations(styleAssociations: StyleAssociation[]): Promise<any> 
    {
      return new Promise((resolve, reject) => { 
        const hashedStyleAssociations = styleAssociations.map(styleAssociation => {
            const styleAssociationString = JSON.stringify(styleAssociation);
            const hash = createHash('sha256').update(styleAssociationString).digest('hex');
            return { _id: hash, ...styleAssociation } as Document;
        });
        const collection = this.client.db('styleAssociations').collection('styles_test');
        collection.insertMany(hashedStyleAssociations)
            .then(result => {
                console.log(`Successfully inserted ${result.insertedCount} items.`);
                resolve(result); // Resolve the promise with the result
            })
            .catch(error => {
                if (error.code === 11000) {
                    console.log('Attempted to insert a document with a duplicate key. Skipping.');
                    reject(new Error("Duplicate key")); // Use reject here for the error
                } else {
                    console.error('Error in inserting style associations:', error);
                    reject(error); // Reject with the actual error for other cases
                }
            });
        });


    }
}


  

