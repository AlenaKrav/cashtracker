import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 60 * 1000, //durante cuanto tiempo se recuerdan los request = 1 min
  limit: process.env.NODE_ENV === 'production' ? 5 : 16, //cuantos request le vamos a permitir al cliente durante ese minuto, en total 5req/min
  message: {
    error: "Alcanzado el limite de peticiones",
  },
});
