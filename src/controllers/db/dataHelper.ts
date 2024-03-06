import { ConnectionPool } from 'mssql';

class DataHelper
{
    private dbConfig = 
      {
        user: 'root',
        password: 'root',
        server: 'localhost:5050', 
        database: 'desarrollo',
        options: 
        {
          encrypt: true, 
          trustServerCertificate: true 
        }
      };

      private pool: ConnectionPool;

      constructor() 
      {
        this.pool = new ConnectionPool(this.dbConfig);
        this.connect();
      }

      private async connect() 
      {
        try 
        {
          await this.pool.connect();
          console.log('Connected to the MSSQL database successfully');
        } catch (error) { console.error('Failed to connect to the database:', error); }
      }
    }

export default DataHelper;
