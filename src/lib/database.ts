//creacion de la conexion a la base de datos

import MongoClient from 'mongodb';
import chalk from 'chalk';
class Database {
  async init() {
    const MONGO_DB =
      process.env.DATABASE || 'mongodb://localhost:27017/uaem-web';
    const client = await MongoClient.connect(MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db();

    //impresion para verificar si la base de datos esta conectada correctamente 
    if (client.isConnected()) {
      console.log(`STATUS: ${chalk.green('ONLINE')}`);
      console.log(`DATABASE: ${chalk.green(db.databaseName)}`);
    }
    return db;
  }
}

export default Database;
