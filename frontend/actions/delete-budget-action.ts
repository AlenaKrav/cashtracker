"use server";

import getToken from "@/src/auth/token";
import {
  Budget,
  CheckPasswordSchema,
  ErrorSchema,
  SuccessSchema,
} from "@/src/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type ActionStateType = {
  success: string;
  serverError: string;
  errors: string[];
};

export async function deleteBudget(
  budgetId: Budget["id"],
  prevState: ActionStateType,
  formData: FormData,
) {
  //obtenemos el password del formData
  const deleteBudgetForm = {
    password: formData.get("password"),
  };

  //validamos su formato con zod
  const validatedCheckPasswordSchema =
    CheckPasswordSchema.safeParse(deleteBudgetForm);

  //si hay errores de zod
  if (!validatedCheckPasswordSchema.success) {
    const errors = validatedCheckPasswordSchema.error.issues.map(
      (error) => error.message,
    );
    return {
      success: "",
      errors,
      serverError: "",
    };
  }

  //obtenemos el token
  const token = getToken();
  if (!token) {
    redirect("auth/login");
  }

  //enviamos el request al backend para verificar el password
  const checkPasswordUrl = `${process.env.API_URL}/auth/check-password`;
  const checkPasswordReq = await fetch(checkPasswordUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      password: validatedCheckPasswordSchema.data.password,
    }),
  });

  const checkPasswordJson = await checkPasswordReq.json();

  //si hay errores por parte del server
  if (!checkPasswordReq.ok || checkPasswordJson.error) {
    const error = ErrorSchema.parse(checkPasswordJson);
    return {
      success: "",
      errors: [],
      serverError: error.error,
    };
  }

  //si no hay ningun error procedemos a borrar el registro
  const deleteBudgetUrl = `${process.env.API_URL}/budgets/${budgetId}`;
  const deleteBudgetReq = await fetch(deleteBudgetUrl, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const delteBudgetJson = await deleteBudgetReq.json();

  if (!deleteBudgetReq.ok || delteBudgetJson.error) {
    const error = ErrorSchema.parse(delteBudgetJson);
    return {
      success: "",
      errors: [],
      serverError: error.error,
    };
  }

  revalidatePath('/admin')
  const success = SuccessSchema.parse(delteBudgetJson);

  return {
    success: success.message,
    errors: [],
    serverError: "",
  };
}
