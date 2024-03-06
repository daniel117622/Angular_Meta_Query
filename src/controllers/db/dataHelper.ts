import { MongoClient } from 'mongodb';


export class DataHelper
{    
    
    public static connectedStatus: boolean = false;
    private client: MongoClient;  
    
    constructor(env_uri : string) 
    {
      this.client = new MongoClient(env_uri);
      this.connect();
    }

    private connect(): void {
      this.client.connect().then(() => {
          console.log('Connected to the MongoDB database successfully');
          DataHelper.connectedStatus = true;
      }).catch((error) => {
          console.error('Failed to connect to the database:', error);
      });
    }

}
  

