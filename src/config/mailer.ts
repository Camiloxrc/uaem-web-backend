import chalk from 'chalk';
import nodemailer from 'nodemailer';

export const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

transport.verify().then(() => {
  console.log(`STATUS: ${chalk.greenBright('ONLINE')}`);
  console.log(`MESSAGE: ${chalk.greenBright('Conexion con email')}`);
}).catch( error => {
  console.log(`STATUS: ${chalk.redBright('OFFLINE')}`);
  console.log(`MESSAGE: ${chalk.redBright(error)}`);
});
