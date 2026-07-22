"use server";

import { ErrorSchema, SuccessSchema, TokenSchema } from "@/src/schemas";

type ActionStateType = {
  success: string,
  serverError: string,
  errors: string[]
};

export async function ConfirmAccount(
  token: string,
  prevState: ActionStateType,
) {
  console.log(token);

  const confirmedToken = TokenSchema.safeParse(token);
  console.log(confirmedToken);

  if (!confirmedToken.success) {
    //si hay errores de validacion de zod
    return {
      errors: confirmedToken.error.issues.map((issue) => issue.message),
      success: "",
      serverError: "",
    };
  }

  //enviamos el request
  const url = `${process.env.API_URL}/auth/confirm-account`;
  const request = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: confirmedToken.data,
    }),
  });

  //recibimos la response
  const json = await request.json();
  //si esto va mal
  //devolver el error del server
  console.log("JSON DEL REQUEST", json);

  if (!request.ok || json.error) {
    const error = ErrorSchema.parse(json);
    console.log("MENSAJE DE ERROR", json.error);
    return {
      errors: [],
      success: "",
      serverError: error.error,
    };
  }

  const success = SuccessSchema.parse(json);
  console.log("MENSAJE DE ÉXITO", json.message);
  return {
    errors: [],
    success: success.message,
    serverError: "",
  };
}
