import { IVariables } from './../interfaces/variables-interface';
import { IContextData } from './../interfaces/context-data.interface';
import {
  findElements,
  findOneElement,
  insertOneElement,
  updateOneElement,
  deleteOneElement,
} from './../lib/db-operations';
import { Db } from 'mongodb';

class ResolversOperationsService {
  private variables: IVariables;
  private context: IContextData;
  constructor(root: object, variables: IVariables, context: IContextData) {
    this.variables = variables;
    this.context = context;
  }

  protected getContext(): IContextData { return this.context; }
  protected getDb(): Db {
    return this.context.db!;
  }
  protected getVariables(): IVariables {
    return this.variables;
  }
  // Listar información
  protected async list(collection: string, listElement: string) {
    try {
      return {
        status: true,
        message: `Lista de ${listElement} correctamente cargada`,
        items: await findElements(this.getDb(), collection),
      };
    } catch (error) {
      return {
        status: false,
        message: `Lista de ${listElement} no cargada: ${error}`,
        items: null,
      };
    }
  }
  // Obtener detalles del item
  protected async get(collection: string) {
    const collectionLabel = collection.toLowerCase();
    try {
      return await findOneElement(this.getDb(), collection, {
        id: this.variables.id,
      }).then((result) => {
        if (result) {
          return {
            status: true,
            message: `${collectionLabel} ha sido cargada correctamente con sus detalles`,
            item: result,
          };
        }
        return {
          status: true,
          message: `${collectionLabel} no ha obtenido detalles porque no existe`,
          item: null,
        };
      });
    } catch (error) {
      return {
        status: false,
        message: `Error inesperado al querer cargar los detalles de ${collectionLabel}`,
        item: null,
      };
    }
  }
  // Añadir item
  protected async add(collection: string, document: object, item: string) {
    try {
      return await insertOneElement(this.getDb(), collection, document).then(
        (res) => {
          if (res.result.ok === 1) {
            return {
              status: true,
              message: `Añadido correctamente el ${item}.`,
              item: document,
            };
          }
          return {
            status: false,
            message: `No se ha insertado el ${item}.`,
            item: null,
          };
        }
      );
    } catch (error) {
      return {
        status: false,
        message: `Error CRITICO al insertar el ${item}.`,
        item: null,
      };
    }
  }
  // Modificar item
  protected async update(
    collection: string,
    filter: object,
    objectUpdate: object,
    item: string
  ) {
    try {
      return await updateOneElement(
        this.getDb(),
        collection,
        filter,
        objectUpdate
      ).then((res) => {
        if (res.result.nModified === 1 && res.result.ok) {
          return {
            status: true,
            message: `Elemento ${item} actualizado correctamente.`,
            item: Object.assign({}, filter, objectUpdate),
          };
        }
        return {
          status: false,
          message: `Elemento ${item} No se ha actualizado`,
          item: null,
        };
      });
    } catch (error) {
      return {
        status: false,
        message: `Error CRITICO al actualizar el ${item}.`,
        item: null,
      };
    }
  }
  // eliminar item
  protected async del(collection: string, filter: object, item: string) {
    try {
      return await deleteOneElement(this.getDb(), collection, filter).then(
        (res) => {
          if (res.deletedCount === 1) {
            return {
              status: true,
              message: `Elemento ${item} borrado correctamente.`,
            };
          }
          return {
            status: false,
            message: `Elemento ${item} No se ha borrado.`,
          };
        }
      );
    } catch (error) {
      return {
        status: false,
        message: `Error CRITICO al eliminar el ${item}.`,
      };
    }
  }
}

export default ResolversOperationsService;