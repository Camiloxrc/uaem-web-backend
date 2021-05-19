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
import { pagination } from '../lib/pagination';

class ResolversOperationsService {
  private variables: IVariables;
  private context: IContextData;
  constructor(root: object, variables: IVariables, context: IContextData) {
    this.variables = variables;
    this.context = context;
  }

  protected getContext(): IContextData {
    return this.context;
  }
  protected getDb(): Db {
    return this.context.db!;
  }
  protected getVariables(): IVariables {
    return this.variables;
  }
  // Listar información
  protected async list(
    collection: string,
    listElement: string,
    page: number = 1,
    itemsPage: number = 20,
    filter: object = { active: { $ne: false}}
  ) {
    try {
      console.log(page, itemsPage);
      const paginationData = await pagination(
        this.getDb(),
        collection,
        page,
        itemsPage,
        filter
      );
      return {
        info: {
          page: paginationData.page,
          pages: paginationData.pages,
          itemsPage: paginationData.itemsPage,
          total: paginationData.total,
        },
        status: true,
        message: `Lista de ${listElement} cargada`,
        items: await findElements(this.getDb(), collection, {}, paginationData),
      };
    } catch (error) {
      return {
        info: null,
        status: false,
        message: `Lista de ${listElement} sin datos: ${error}`,
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
            message: `${collectionLabel} ha sido cargada`,
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
        message: `Error CRITICO EN los detalles de ${collectionLabel}`,
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
              message: `Te registraste correctamente ${item}.`,
              item: document,
            };
          }
          return {
            status: false,
            message: `No se pudo agregar el ${item}.`,
            item: null,
          };
        }
      );
    } catch (error) {
      return {
        status: false,
        message: `Error CRITICO al agregar el ${item}.`,
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
          message: `Elemento ${item} No se ha actualizado.`,
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
              message: `Elemento ${item} eliminado correctamente.`,
            };
          }
          return {
            status: false,
            message: `Elemento ${item} No se ha podido eliminar.`,
          };
        }
      );
    } catch (error) {
      return {
        status: false,
        message: `Error CRITICO al intentar eliminar el ${item}.`,
      };
    }
  }
}

export default ResolversOperationsService;
