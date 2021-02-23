import { Db } from "mongodb";
//asignacion del ID para el usuario
export const asignDocumentId = async (
  database: Db, //base de datos
  collection: string, //coleccion en donde se hara la busqueda
  sort: object = { registerdate: -1 } //manera de ordenar
) => {
  const lastElement = await database
    .collection(collection)
    .find()
    .limit(1)
    .sort(sort)
    .toArray();
  if (lastElement.length === 0) {
    return 1;
  }
  return lastElement[0].id + 1;
};

export const findOneElement = async (
  database: Db, //base de datos
  collection: string, //coleccion en donde se hara la busqueda
  filter: object
) => {
  return database.collection(collection).findOne(filter);
};

export const insertOneElement = async (
  database: Db, //base de datos
  collection: string, //coleccion en donde se hara la busqueda
  document: object
) => {
  return await database.collection(collection).insertOne(document);
};

export const insertManyElements = async (
  database: Db, //base de datos
  collection: string, //coleccion en donde se hara la busqueda
  documents: Array<object> //listasssssss de documentos
) => {
  return await database.collection(collection).insertMany(documents);
};

export const findElements = async (
    database: Db, //base de datos
    collection: string, //coleccion en donde se hara la busqueda
    filter: object = {}
) => {
    return await database.collection(collection).find(filter).toArray();
};