import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { createServer } from 'http';
import environments from './config/environments';
import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import expressPlayground from 'graphql-playground-middleware-express';
import Database from './lib/database';
import { IContext } from './interfaces/context.interface';

//variables de entorno conf 
if(process.env.NODE_ENV !== 'production'){
  const env = environments;
  console.log(env);
}

//Creacion del servidor Node Express
async function init() {
  const app = express();
  app.use(cors());
  app.use(compression());

  //Anadimos la conexion a nuestra base datos
  const database = new Database();
  const db = await database.init();
  //conexion mediante el token
  const context = async({req, connection}: IContext) => {
    const token = (req) ? req.headers.authorization : connection.authorization;
    return { db, token };
  };

  //imp apollo server
  const server = new ApolloServer({
    schema,
    introspection: true,
    context
  });

  server.applyMiddleware({app});
  app.get('/',expressPlayground({
    endpoint: 'graphql'
  }));

//Creacion del http escuachando las peticiones del puerto 8000

  const httpServer = createServer(app);
  const PORT =process.env.PORT || 8000;

  httpServer.listen(
    {
      port: PORT
    },
    () => console.log(`http://localhost:${PORT} No more fake tears`)
  );
}
init();

/*Dedicado a Marcelino por ser un ejemplo a seguir.
Todo hombre muere, pero no todos los hombres realmente viven como tú lo hiciste.
Por siempre y para siempre tu familia estara contigo donde quiera que estes) Cuidate brother))))
*/