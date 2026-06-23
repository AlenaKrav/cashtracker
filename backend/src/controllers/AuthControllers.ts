import type { Request, Response } from "express";
import User from "../models/User";
import { hashPassword, verifyPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({
      where: {
        email,
      },
    });
    if (existingUser) {
      const error = new Error("Este usuario ya está registrado");
      return res.status(409).json({ error: error.message });
    }
    try {
      //creamos un user en memoria antes de guardarlo en la bd
      //estamos montando una futura fila de la tabla y luego se modifica el passw, se genera el token
      const user = new User(req.body);
      user.password = await hashPassword(password);
      user.token = generateToken();
      await user.save();

      // gestionamos el envio de mail
      await AuthEmail.sendConfitmationEmail({
        name: user.name,
        email: user.email,
        token: user.token,
      });

      res.status(201).json({ message: "Usuario creado correctamente" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Ha ocurrido un error al crear el usuario" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    const { token } = req.body;
    const user = await User.findOne({
      where: {
        token,
      },
    });
    if (!user) {
      const error = new Error("Token no válido");
      return res.status(401).json({ error: error.message });
    }
    user.confirmed = true;
    user.token = null; //se borra el token de un solo uso
    await user.save();
    //  await user.update({confirmed: true});
    res.status(200).json({ message: "Cuenta confirmada correctamente" });
  };

  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({
      where: {
        email,
      },
    });

    if (!existingUser) {
      const error = new Error("Usuario no encontrado");
      return res.status(404).json({ error: error.message });
    }

    if (!existingUser.confirmed) {
      const error = new Error("La cuenta no ha sido confirmada");
      return res.status(403).json({ error: error.message });
    }

    const verifiedPass = await verifyPassword(password, existingUser.password);
    if (!verifiedPass) {
      const error = new Error("Password incorrecto");
      return res.status(401).json({ error: error.message });
    }
    const token = generateJWT(existingUser.id)
    res.json(token)
    res.status(200).json({ message: "Logueado correctamente" });
  };
}
