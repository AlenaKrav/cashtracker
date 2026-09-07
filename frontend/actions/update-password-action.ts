"use server";

import getToken from "@/src/auth/token";
import {
  ChangePasswordSchema,
  ErrorSchema,
  SuccessSchema,
} from "@/src/schemas";

type ActionStateType = {
  success: string;
  serverError: string;
  errors: string[];
};

export async function updateUserPassword(
  prevState: ActionStateType,
  formData: FormData,
) {
  const updateUserPasswordFormData = {
    current_password: formData.get("current_password"),
    password: formData.get("password"),
    password_confirmation: formData.get("password_confirmation"),
  };

  const validatedUpdatePasswordFormData = ChangePasswordSchema.safeParse(
    updateUserPasswordFormData,
  );

  if (!validatedUpdatePasswordFormData.success) {
    const errors = validatedUpdatePasswordFormData.error.issues.map(
      (error) => error.message,
    );
    return {
      success: "",
      errors,
      serverError: "",
    };
  }

  const token = getToken();

  const url = `${process.env.API_URL}/auth/update-password`;
  const request = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      currentPassword: validatedUpdatePasswordFormData.data.current_password,
      newPassword: validatedUpdatePasswordFormData.data.password,
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
