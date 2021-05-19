import { COLLECTIONS, EXPIRETIME } from '../config/constants';
import { IContextData } from '../interfaces/context-data.interface';
import { IVariables } from '../interfaces/variables-interface';
import { findOneElement } from '../lib/db-operations';
import JWT from '../lib/jwt';
import MailService from './mail.service';
import bcrypt from 'bcrypt';
import ResolversOperationsService from './resolvers-operations.service';

class PasswordService extends ResolversOperationsService {
  constructor(root: object, variables: IVariables, context: IContextData) {
    super(root, variables, context);
  }
  async resetMail() {
    const email = this.getVariables().user?.email;
    if (email === undefined || email === '') {
      return {
        status: false,
        message:
          'Ingresa un correo valido para cambiar la clave',
      };
    }
    // tomar información del usuario
    const user = await findOneElement(this.getDb(), COLLECTIONS.USERS, {
      email,
    });
    // Si usuario indefinido
    if (user === undefined || user === null) {
      return {
        status: false,
        message: `El email ${user.email} no existe`,
      };
    }
    const newUser = {
      id: user.id,
      email: user.email,
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
  }

  async change() {
    const id = this.getVariables().user?.id;
    let password = this.getVariables().user?.password;
    // comprobar que el id es correcto: no indefinido y no en blanco
    if (id === undefined || id === '') {
      return {
        status: false,
        message: 'El ID no corresponde a una informacion valida',
      };
    }
    // verificacion de la contrasena
    if (password === undefined || password === '') {
      return {
        status: false,
        message: 'La Contraseña no corresponde a una informacion validaa',
      };
    }
    // Encriptar el password
    password = bcrypt.hashSync(password, 10);
    // actualizar el id 
    const result = await this.update(
      COLLECTIONS.USERS,
      { id },
      { password },
      'usuario'
    );
    return {
      status: result.status,
      message: result.status
        ? `Contraseña Cambiada`
        : result.message,
    };
  }
}

export default PasswordService;
