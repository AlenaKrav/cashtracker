"use server";

import { ErrorSchema, ResetPasswordSchema, SuccessSchema } from "@/src/schemas";

type ActionStateType = {
  success: string;
  errors: string[];
  serverError: string;
};

export async function resetPasswordWithValidToken(
  token: string,
  prevState: ActionStateType,
  formData: FormData,
) {
  console.log(token);
  const resetPasswordFormData = {
    password: formData.get("password"),
    password_confirmation: formData.get("password_confirmation"),
  };

  const validatedPasswordReset = ResetPasswordSchema.safeParse(
    resetPasswordFormData,
  );

  if (!validatedPasswordReset.success) {
    const errors = validatedPasswordReset.error.issues.map(
      (error) => error.message,
    );
    return {
      success: "",
      errors,
      serverError: "",
    };
  }

  const url = `${process.env.API_URL}/auth/reset-password/${token}`;
  const request = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password: validatedPasswordReset.data.password,
    }),
  });

  const json = await request.json();
  
  if (json.error) {
    const error = ErrorSchema.parse(json);
    return {
      success: "",
      errors: [],
      serverError: error.error,
    };
  }

  const success = SuccessSchema.parse(json);
  return {
    success: success.message,
    errors: [],
    serverError: "",
  };
}
