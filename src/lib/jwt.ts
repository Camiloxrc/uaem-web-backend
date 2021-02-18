import { MESSAGES, SECRET_KEY, EXPIRETIME } from './../config/constants';
import jwt from 'jsonwebtoken';
import { IJwt } from '../interfaces/jwt.interface';

//uso de Json web token instalado en las dependencias

// Creacion de token de acceso a la info
class JWT{
    //funcion para la clave
    private secretKey = SECRET_KEY as string;
    //Tiempo de caducidad e informacion del payload
    sign(data: IJwt, expiresIn: number = EXPIRETIME.H24 ) {  
        return jwt.sign(
            { user: data.user},
            this.secretKey,
            { expiresIn} 
        );
    }

    //verificacion del token
    verify(token: string) {
        try {
            return jwt.verify(token, this.secretKey);
        } catch (e) {
            return MESSAGES.TOKEN_VERIFICATION_FAILED;
        }
    }
}

export default JWT; 