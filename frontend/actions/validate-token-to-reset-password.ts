"use server";

import { ErrorSchema, SuccessSchema, TokenSchema } from "@/src/schemas";

type ActionStateType = {
  success: string;
  errors: string[];
  serverError: string;
};

export async function ValidateTokenToResetPassword(
  token: string,
  prevState: ActionStateType,
) {
  const confirmedToken = TokenSchema.safeParse(token);

  if (!confirmedToken.success) {
    return {
      errors: confirmedToken.error.issues.map((issue) => issue.message),
      success: "",
      serverError: "",
    };
  }

  const url = `${process.env.API_URL}/auth/validate-token`;
  const request = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: confirmedToken.data,
    }),
  });

  const json = await request.json();
  console.log(json) // si el token es valido nos devuelve el objeto con el user
  
  if (!request.ok || json.error) {
    const error = ErrorSchema.parse(json);
    return {
      errors: [],
      success: "",
      serverError: error.error,
    };
  }

  const success = SuccessSchema.parse(json);
  return {
    errors: [],
    success: success.message,
    serverError: "",
  };
}
