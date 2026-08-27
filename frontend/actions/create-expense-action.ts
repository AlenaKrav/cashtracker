"use server";

import getToken from "@/src/auth/token";
import { CreateExpenseSchema, ErrorSchema, SuccessSchema } from "@/src/schemas";
import { redirect } from "next/navigation";

type ActionStateType = {
  success: string;
  serverError: string;
  errors: string[];
};

export async function createExpense(
  budgetId: number,
  prevState: ActionStateType,
  formData: FormData,
) {
  console.log("Desde create expense");

  const createExpenseFormData = {
    name: formData.get("name"),
    amount: formData.get("amount"),
  };

  const validatedCreateExpenseFormData = CreateExpenseSchema.safeParse(
    createExpenseFormData,
  );

  if (!validatedCreateExpenseFormData.success) {
    const errors = validatedCreateExpenseFormData.error.issues.map(
      (error) => error.message,
    );
    return {
      success: "",
      errors,
      serverError: "",
    };
  }

  const token = getToken();

  const url = `${process.env.API_URL}/budgets/${budgetId}/expenses`;
  const request = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: validatedCreateExpenseFormData.data.name,
      amount: validatedCreateExpenseFormData.data.amount,
    }),
  });

  const json = await request.json();

  if (!request.ok || json.error) {
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
