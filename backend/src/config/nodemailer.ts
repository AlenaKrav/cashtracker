import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const config = () => {
  return {
    host: process.env.EMAIL_HOST,
    port: +process.env.EMAIL_PORT, //por defecto las variables de entorno se leen como string, '+' hace que se lea como un numero
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };
};

export const transport = nodemailer.createTransport(config());
