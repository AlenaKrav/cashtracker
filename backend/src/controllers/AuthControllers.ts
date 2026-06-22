import type { Request, Response } from "express";
import User from "../models/User";
import { hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";

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
      const user = new User(req.body);
      user.password = await hashPassword(password);
      user.token = generateToken();
      await user.save();
      res.status(201).json({ message: "Usuario creado correctamente" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Ha ocurrido un error al crear el usuario" });
    }
  };
}
