import type { Request, Response, NextFunction } from "express";
import { decodeJWT } from "../utils/jwt";
import User from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const autenticateUser = async (req: Request, res: Response, next: NextFunction) => {
        const bearer = req.headers.authorization;
    if(!bearer) {
      const error = new Error("Acceso no autorizado");
      return res.status(401).json({ error: error.message });
    }
    const [texto, token] = bearer.split(' ');
    if(!token) {
      const error = new Error("Token no válido. Acceso no autorizado");
      return res.status(401).json({ error: error.message });
    }

    try {
      const decodedToken = decodeJWT(token);
      if(typeof decodedToken === 'object' && decodedToken.id){
          req.user = await User.findByPk(decodedToken.id, {attributes: ['id', 'name', 'email']});
          next();
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}