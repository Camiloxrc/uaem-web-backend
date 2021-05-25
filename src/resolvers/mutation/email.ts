import { IResolvers } from 'graphql-tools';
import { COLLECTIONS, EXPIRETIME, MESSAGES } from '../../config/constants';
import { findOneElement } from '../../lib/db-operations';
import JWT from '../../lib/jwt';
import MailService from '../../services/mail.service';
import PasswordService from '../../services/password.service';
import UsersService from '../../services/users.service';

const resolversMailMutation: IResolvers = {
  Mutation: {
    async sendEmail(_, { mail }) {
      return new MailService().send(mail);
    },
    async activeUserEmail(_, { id, email }) {
      return new UsersService(_, {user: {id, email}}, {}).activeEmail();
    },
    async activeUserAction(_, { id, birthday, password }, {token, db}) {
      const verify = verifyToken(token, id);
      if (verify?.status === false) {
        return { status: false, message: verify.message};
      }
      return new UsersService(_, { id, user: { birthday, password } }, {token, db}).unblock(true);
    },
    async resetPassword(_, {email}, {db}) {
      const user = await findOneElement(db, COLLECTIONS.USERS, { email});
      // Si usuario es indefinido mandamos un mensaje que no existe el usuario
      if (user === undefined || user === null) {
        return {
          status: false,
          message: `Usuario con el email ${email} no existe`
        };
      }
      const newUser = {
        id: user.id,
        email
      };
      const token = new JWT().sign({ user: newUser }, EXPIRETIME.M15);
      const html = 
      `<h1>Restablecer contraseña</h1>
      <br>Usa este enlace para restablecer la contraseña de tu cuenta: <a href="${process.env.CLIENT_URL}/reset/${token}">hacer clic aquí </a><br>
      <br> Si no reconoce la cuenta ignore este mensaje.<br>
      <br>Gracias.
      <br>Equipo de cuentas UAEM.
      `;
      const mail = {
        to: email || '',
        subject: 'Restablecimiento de contraseña de la cuenta Tienda UAEM',
        html,
      };
      return new MailService().send(mail);
    },
    async changePassword(_, { id, password}, { db, token }) {
      // verificar el token
      const verify = verifyToken(token, id);
      if (verify?.status === false) {
        return { status: false, message: verify.message};
      }
      return new PasswordService(_, {user: { id, password}}, {db}).change();
    }
  },
};

function verifyToken(token: string, id: string) {
  // verificar el token
  const checkToken = new JWT().verify(token);
  if (checkToken === MESSAGES.TOKEN_VERIFICATION_FAILED) {
    return {
      status: false,
      message: 'El periodo para activar el usuario ha finalizado. Contacta con el administrador para más información.',
    };
  }
  // Si el token es valido , asignamos la información al usuario
  const user = Object.values(checkToken)[0];
  if (user.id !== id) {
    return {
      status: false,
      message: 'El usuario del token no corresponde al añadido en el argumento'
    };
  }
}

export default resolversMailMutation;