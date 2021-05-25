//Config de las variables de entorno
import environment from './environments';

if (process.env.NODE_ENV !== 'production') {
  const env = environment;
}
// Clave privada que ocupamos en el token
export const SECRET_KEY = process.env.SECRET || 'gonzamalparido12xd';

export enum COLLECTIONS {
  USERS = 'users',
  GENRES = 'genres',
  TAGS = 'tags',
  SHOP_PRODUCT = 'products_platforms',
  PRODUCTS = 'products',
  PLATFORMS = 'platforms'
}

//Mensajes de error
export enum MESSAGES {
  TOKEN_VERIFICATION_FAILED = 'Token Invalido o caducado',
}
//Tiempos dinamicos para la caducidad del token
export enum EXPIRETIME {
  H1 = 60 * 60,
  H24 = 24 * H1,
  M15 = H1 / 4,
  M20 = H1 / 3,
  D5 = H24 * 5,
}
export enum ACTIVE_VALUES_FILTER {
  ALL = 'ALL',
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE'
}