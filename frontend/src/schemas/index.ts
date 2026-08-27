import { z } from "zod";

export const RegisterSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "El email es obligatorio" })
      .pipe(z.email("Email no válido")),
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
  message: z
    .string()
    .min(1, { message: "Valor devuelto por el servidor no es válido" }),
});

export const ErrorSchema = z.object({
  error: z
    .string()
    .min(1, { message: "Valor devuelto por el servidor no es válido" }),
});

export const TokenSchema = z
  .string({ message: "Token no valido" })
  .length(6, { message: "Token no valido" });

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El email es obligatorio" })
    .pipe(z.email("Email no válido")),
  password: z.string().min(1, { error: "El password es obligatorio" }),
});

export const SuccessLoginSchema = z.object({
  message: z
    .string()
    .min(1, { message: "Valor devuelto por el servidor no es válido" }),
  token: z
    .string()
    .min(1, { message: "Valor devuelto por el servidor no es válido" }),
});

export const authenticatedUser = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().pipe(z.email()),
});

export type User = z.infer<typeof authenticatedUser>;

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El email es obligatorio" })
    .pipe(z.email("Email no válido")),
});

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { error: "La contraseña debe tener 8 caracteres como mínimo" }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    error: "Las contraseñas deben coincidir",
    path: ["password_confirmation"],
  });

export const CreateBudgetSchema = z.object({
  name: z
    .string()
    .min(1, { message: "El nombre de presupuesto es obligatorio" }),
  amount: z.coerce //nos permite convertir un string a number
    .number({ message: "Cantidad no válida" })
    .min(1, { message: "Cantidad no válida" }),
});

export const CreateExpenseSchema = z.object({
  name: z
    .string()
    .min(1, { message: "El nombre de gasto es obligatorio" }),
  amount: z.coerce //nos permite convertir un string a number
    .number({ message: "Cantidad no válida" })
    .min(1, { message: "Cantidad no válida" }),
});

export const BudgetAPIResponseSchema = z.object({
        id: z.number(),
        name: z.string(),
        amount: z.number(),
        userId: z.number(),
        createdAt: z.string(),
        updatedAt: z.string()
});

export type Budget = z.infer<typeof BudgetAPIResponseSchema>
export const BudgetsAPIResponseSchema = z.array(BudgetAPIResponseSchema);

export const CheckPasswordSchema = z.object({
  password: z
      .string()
      .min(8, { error: "La contraseña debe tener 8 caracteres como mínimo" })
})