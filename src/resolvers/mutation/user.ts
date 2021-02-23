import { insertOneElement } from './../../lib/db-operations';
import { COLLECTIONS } from './../../config/constants';
import { IResolvers } from 'graphql-tools';
import bcrypt from 'bcrypt';
import { asignDocumentId, findOneElement } from '../../lib/db-operations';

const resolversUserMutation: IResolvers = {
  Mutation: {
    async register(_, { user }, { db }) {
      //comprobacion que las credenciales del usuario aun no estan registradas
        const userCheck = await findOneElement(db,COLLECTIONS.USERS,{email: user.email});

          if(userCheck !== null){
            return {
              status: false,
              message: `El email ${user.email} ya esta registrado`,
              user: null
            };
          }
      //Asignacion de la id tomando en cuanta el ultimo user registrado
          user.id = await asignDocumentId(db,COLLECTIONS.USERS, {registerdate: -1 });
      //Asignamos la fecha con el formato ISO
      user.registerdate = new Date().toISOString();

      // Encriptacion de la contrasena con el uso de bcrypt
        user.password = bcrypt.hashSync(user.password, 10);
      
      //Guardar los datos en la coleccion de la db
      return await insertOneElement(db, COLLECTIONS.USERS, user)
        .then(async () => {
          return {
            status: true,
            message: `Bienvenido ${user.email} te has registrado correctamente`,
            user
          };
         
        })
        //comprobacion de error al intentar guardar los datos
        .catch((err: Error) => {
          console.log(err.message);
          return {
            status: false,
            message: 'Se ha producido un error al hacer el registro',
            user: null
          };
        });
    },
  },
};

export default resolversUserMutation;
