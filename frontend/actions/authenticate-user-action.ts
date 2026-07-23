"use server";

import { ErrorSchema, LoginSchema, SuccessLoginSchema } from "@/src/schemas";
import { cookies } from "next/headers";
import {redirect } from 'next/navigation';

type ActionStateType = {
  serverError: string;
  errors: string[];
};

export async function Authenticate(
  prevState: ActionStateType,
  formData: FormData,
) {
  const LoginFormData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  // validar
  const validatedLogin = LoginSchema.safeParse(LoginFormData);
  console.log("RESULTADO VALIDACIÓN DE CAMPOS DEL FORM", validatedLogin);

  if (!validatedLogin.success) {
    const errors = validatedLogin.error.issues.map((error) => error.message);
    return {
      errors,
      serverError: "",
    };
  }

  // loguear al user
  const url = `${process.env.API_URL}/auth/login`;
  const request = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: validatedLogin.data.email,
      password: validatedLogin.data.password,
    }),
  });

  //ESTO ES LO QUE NOS DEVUELVE EL SERVER (MENSAJE DE SUCCES O CON EL ERROR)
  const json = await request.json();
  // console.log("JSON DEL LOGIN REQUEST", json);

  if (!request.ok || json.error) {
    const error = ErrorSchema.parse(json);
    console.log("ESTE ES UN MENSAJE DE ERROR", error.error);
    return {
      errors: [],
      serverError: error.error,
    };
  }

  //setear la cookie
  cookies().set({
    name: "CASHTRACKER_TOKEN",
    value: json.token,
    httpOnly: true,
    path: "/",
  });

  redirect('/admin'); //despues de esto ya no es necesario devolver el mensaje de exito

}
