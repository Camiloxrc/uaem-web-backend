import { COLLECTIONS } from './../config/constants';
import { IResolvers } from 'graphql-tools';
import bcrypt from 'bcrypt';

const resolversMutation: IResolvers = {
  Mutation: {
    async register(_, { user }, { db }) {
      //comprobacion que las credenciales del usuario aun no estan registradas
        const userCheck = await db.collection(COLLECTIONS.USERS).
          findOne({email: user.email});

          if(userCheck !== null){
            return {
              status: false,
              message: `El email ${user.email} ya esta registrado`,
              user: null
            };
          }
      //Asignacion de la id tomando en cuanta el ultimo user registrado
      const lastUser = await db
        .collection(COLLECTIONS.USERS)
        .find()
        .limit(1)
        .sort({ registerdate: -1 })
        .toArray();
      if (lastUser.length === 0) {
        user.id = 1;
      } else {
        user.id = lastUser[0].id + 1;
      }
      //Asignamos la fecha con el formato ISO
      user.registerdate = new Date().toISOString();

      // Encriptacion de la contrasena con el uso de bcrypt
        user.password = bcrypt.hashSync(user.password, 10);
      
      //Guardar los datos en la coleccion de la db
      return await db
        .collection(COLLECTIONS.USERS)
        .insertOne(user)
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

export default resolversMutation;
