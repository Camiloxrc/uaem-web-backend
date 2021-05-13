import { findOneElement, asignDocumentId } from './../lib/db-operations';
import { COLLECTIONS, EXPIRETIME, MESSAGES } from '../config/constants';
import { IContextData } from '../interfaces/context-data.interface';
import ResolversOperationsService from './resolvers-operations.service';
import bcrypt from 'bcrypt';
import JWT from '../lib/jwt';
class UsersService extends ResolversOperationsService {
  private collection = COLLECTIONS.USERS;
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }

  // Lista de usuarios
  async items() {
    const page = this.getVariables().pagination?.page;
    const itemsPage = this.getVariables().pagination?.itemsPage;
    const result = await this.list(this.collection, 'usuarios', page, itemsPage);
    return {
      info: result.info,
      status: result.status,
      message: result.message,
      users: result.items,
    };
  }
  // Autenticarnos
  async auth() {
    let info = new JWT().verify(this.getContext().token!);
    if (info === MESSAGES.TOKEN_VERIFICATION_FAILED) {
      return {
        status: false,
        message: info,
        user: null,
      };
    }
    return {
      status: true,
      message: 'Usuario verificado con el token',
      user: Object.values(info)[0],
    };
  }
  // Iniciar sesión
  async login() {
    try {
      const variables = this.getVariables().user;
      const user = await findOneElement(this.getDb(), this.collection, {
        email: variables?.email,
      });
      if (user === null) {
        return {
          status: false,
          message: 'El usuario no existe',
          token: null,
        };
      }
      const passwordCheck = bcrypt.compareSync(
        variables?.password,
        user.password
      );

      if (passwordCheck !== null) {
        delete user.password;
        delete user.birthday;
        delete user.registerdate;
      }
      return {
        status: passwordCheck,
        message: !passwordCheck
          ? 'Contraseña Incorrecta'
          : `Bienvenido ${user?.name}`,
        token: !passwordCheck ? null : new JWT().sign({ user }, EXPIRETIME.H24),
        user: !passwordCheck ? null : user,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message:
          'Error CRITICO al cargar los datos del usuario',
        token: null,
      };
    }
  }
  // Registrar un usuario
  async register() {
    const user = this.getVariables().user;

    // comprobar que user no es null
    if (user === null) {
      return {
        status: false,
        message: 'Usuario no establecido',
        user: null,
      };
    }
    if (
      user?.password === null ||
      user?.password === undefined ||
      user?.password === ''
    ) {
      return {
        status: false,
        message: 'Contraseña no valida',
        user: null,
      };
    }
    // Comprobar que el usuario no existe
    const userCheck = await findOneElement(this.getDb(), this.collection, {
      email: user?.email,
    });

    if (userCheck !== null) {
      return {
        status: false,
        message: `El email ${user?.email} se encuentra registrado`,
        user: null,
      };
    }

    // COmprobar el último usuario registrado para asignar ID
    user!.id = await asignDocumentId(this.getDb(), this.collection, {
      registerdate: -1,
    });
    // Asignar la fecha en formato ISO en la propiedad registerdate
    user!.registerdate = new Date().toISOString();
    // Encriptar password
    user!.password = bcrypt.hashSync(user!.password, 10);

    const result = await this.add(this.collection, user || {}, 'usuario');
    // Guardar el documento (registro) en la colección
    return {
      status: result.status,
      message: result.message,
      user: result.item,
    };
  }
  // Modificar un usuario
  async modify() {
    const user = this.getVariables().user;
    // comprobar que user no es null
    if (user === null) {
      return {
        status: false,
        message: 'Usuario establecido',
        user: null,
      };
    }
    const filter = { id: user?.id };
    const result = await this.update(
      this.collection,
      filter,
      user || {},
      'usuario'
    );
    return {
      status: result.status,
      message: result.message,
      user: result.item,
    };
  }
  // Borrar el usuario seleccionado
  async delete() {
    const id = this.getVariables().id;
    if (id === undefined || id === '') {
      return {
        status: false,
        message:
          'Identificador no valido',
        user: null,
      };
    }
    const result = await this.del(this.collection, { id }, 'usuario');
    return {
      status: result.status,
      message: result.message,
    };
  }
  async block() {
    const id = this.getVariables().id;
    if (!this.checkData(String(id) || '')) {
        return {
            status: false,
            message: 'El ID del usuario no se ha especificado correctamente',
            genre: null
        };
    }
    const result = await this.update(this.collection, { id }, { active: false }, 'usuario');
    return {
        status: result.status,
        message: (result.status) ? 'Bloqueado correctamente': 'No se ha bloqueado comprobarlo por favor'
    };
  }
  private checkData(value: string) {
    return (value === '' || value === undefined) ? false: true;
}
}

export default UsersService;