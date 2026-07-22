import { z } from "zod";

export const RegisterSchema = z
  .object({
    email: z.string()
            .min(1, {message: 'El email es obligatorio'})
            .pipe(z.email('Email no válido')),
    name: z.string().min(1, { error: "El nombre es obligatorio" }),
    password: z
      .string()
      .min(8, { error: "La contraseña debe tener 8 caracteres como mínimo" }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    error: "Las contraseñas deben coincidir",
    path: ["password_confirmation"],
  });

  export const SuccessSchema = z.object({
    message: z.string().min(1, {message: 'Valor devuelto por el servidor no es válido'})
  });


   export const ErrorSchema = z.object({
    error: z.string().min(1, {message: 'Valor devuelto por el servidor no es válido'})
  });

  export const TokenSchema = z.string({message: 'Token no valido'}).length(6,{message: 'Token no valido'})
