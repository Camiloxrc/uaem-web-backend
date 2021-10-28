import { IResolvers } from "graphql-tools";
import { COLLECTIONS, EXPIRETIME, MESSAGES } from "../../config/constants";
import { findOneElement } from "../../lib/db-operations";
import JWT from "../../lib/jwt";
import MailService from "../../services/mail.service";
import PasswordService from "../../services/password.service";

const resolversMailMutation: IResolvers = {
  Mutation: {
    async sendEmail(_, { mail }) {
      return new MailService().send(mail);
    },
    async resetPassword(_, { email }, { db }) {
      const user = await findOneElement(db, COLLECTIONS.USERS, { email });
      // Si usuario es indefinido mandamos un mensaje que no existe el usuario
      if (user === undefined || user === null) {
        return {
          status: false,
          message: `Usuario con el email ${email} no existe`,
        };
      }
      const newUser = {
        id: user.id,
        email,
      };
      const token = new JWT().sign({ user: newUser }, EXPIRETIME.M15);
      const html = `<div class="">
      <div class="aHl"></div>
      <div id=":cl" tabindex="-1"></div>
      <div id=":dn" class="ii gt">
        <div id=":dm" class="a3s aiL">
          <u></u>
          <div>
            <table
              width="100%"
              border="0"
              cellspacing="0"
              cellpadding="0"
              bgcolor="#ffffff"
            >
              <tbody>
                <tr>
                  <td style="font-size: 0">&nbsp;</td>
                  <td
                    align="center"
                    valign="middle"
                    width="600"
                    height="300"
                    bgcolor="#ffffff"
                  >
                    <table
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        background-color: #ffffff;
                        border: solid 1px #dddddd;
                        margin-top: 16px;
                        border-radius: 8px 8px 0px 0px;
                      "
                    >
                      <tbody>
                        <tr></tr>
                        <tr>
                          <td
                            style="
                              text-align: left;
                              height: 64px;
                              padding: 12px 0px 4px 16px;
                            "
                          >
                            <a>
                              <h2
                                style="
                                  margin-top: 0px;
                                  margin-bottom: 8px;
                                  color: #1b5ab9;
                                "
                              >
                                UAEM STORE
                              </h2>
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
    
                    <table
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        background-color: #ffffff;
                        border-bottom: solid 1px #dddddd;
                        border-right: solid 1px #dddddd;
                        border-left: solid 1px #dddddd;
                      "
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              text-align: left;
                              line-height: 24px;
                              vertical-align: middle;
                              font-size: 16px;
                              padding: 16px;
                            "
                          >
                            <h2
                              style="
                                margin-top: 0px;
                                margin-bottom: 8px;
                                color: #1b5ab9;
                              "
                            >
                              Crea una nueva contraseña
                            </h2>
                            <p style="margin: 0px; color: #666666">
                              Haz click en el siguiente botón para crear una nueva
                              contraseña:
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
    
                    <table
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        background-color: #ffffff;
                        border-bottom: solid 1px #dddddd;
                        border-right: solid 1px #dddddd;
                        border-left: solid 1px #dddddd;
                      "
                    >
                      <!--enlac para las contrasenas-->
                      <tbody>
                        <tr>
                          <td
                            style="
                              text-align: center;
                              line-height: 24px;
                              vertical-align: middle;
                              font-size: 16px;
                              padding: 32px;
                            "
                          >
                            <a
                              href="${process.env.CLIENT_URL}/reset/${token}"
                              style="
                                text-decoration: none;
                                padding: 16px;
                                border-radius: 4px;
                                background-color: #0066bb;
                                font-size: 16px;
                                font-weight: bold;
                                color: white;
                              "
                              target="_blank"
                            >
                              Crear una nueva contraseña
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
    
                    <table
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        background-color: #ffffff;
                        border-bottom: solid 1px #dddddd;
                        border-right: solid 1px #dddddd;
                        border-left: solid 1px #dddddd;
                      "
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              text-align: left;
                              line-height: 24px;
                              vertical-align: middle;
                              font-size: 16px;
                              padding: 16px;
                            "
                          >
                            <p style="margin: 0px 0px 8px 0px; color: #666666">
                              Este enlace estará disponible sólo las siguientes
                              <span style="font-weight: bold">2 horas</span>.
                            </p>
                            <p style="margin: 0px 0px 8px 0px; color: #666666">
                              Si tú no solicitaste una contraseña nueva, ignore este mensaje.
                            </p>
                            <span style="font-style: italic; color: #999999"
                              >¡Gracias!</span
                            ><br />
                            <span style="color: #999999"
                              >Equipo de cuentas UAEM</span
                            >
    
                            <p></p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
    
                    <table
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        background-color: #2870c2;
                        border-bottom: solid 1px #dddddd;
                        border-right: solid 1px #dddddd;
                        border-left: solid 1px #dddddd;
                        margin-bottom: 16px;
                        border-radius: 0px 0px 8px 8px;
                      "
                    >
                      <tbody>
                        <tr valign="top">
                          <td
                            style="
                              text-align: center;
                              padding: 4px;
                              line-height: 14px;
                              color: #dddddd;
                              font-size: 12px;
                            "
                          >
                            Av. Universidad No. 1001, Col Chamilpa, Cuernavaca,
                            Morelos, México. C.P. 62209
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td style="font-size: 0">&nbsp;</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="yj6qo"></div>
        <div class="yj6qo"></div>
        <div class="yj6qo"></div>
      </div>
      <div id=":cp" class="ii gt" style="display: none">
        <div id=":cq" class="a3s aiL"></div>
      </div>
      <div class="hi"></div>
    </div>
    
      `;
      const mail = {
        to: email || "",
        subject: "Crea una nueva contraseña en UAEM Store",
        html,
      };
      return new MailService().send(mail);
    },
    async changePassword(_, { id, password }, { db, token }) {
      // verificar el token
      const verify = verifyToken(token, id);
      if (verify?.status === false) {
        return { status: false, message: verify.message };
      }
      return new PasswordService(
        _,
        { user: { id, password } },
        { db }
      ).change();
    },
  },
};

function verifyToken(token: string, id: string) {
  // verificar el token
  const checkToken = new JWT().verify(token);
  if (checkToken === MESSAGES.TOKEN_VERIFICATION_FAILED) {
    return {
      status: false,
      message: "El token ha caducado.",
    };
  }
  const user = Object.values(checkToken)[0];
  if (user.id !== id) {
    return {
      status: false,
      message: "El token no corresponde a un usuario valido",
    };
  }
}

export default resolversMailMutation;
