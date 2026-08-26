"use server";

import getToken from "@/src/auth/token";
import { CreateBudgetSchema, ErrorSchema, SuccessSchema } from "@/src/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type ActionStateType = {
  success: string;
  serverError: string;
  errors: string[];
};

export async function editBudget(
  budgetId: number,
  prevState: ActionStateType,
  formData: FormData,
) {
  console.log(budgetId);

  const editBudgetFormData = {
    name: formData.get("name"),
    amount: formData.get("amount"),
  };

  const validatedEditBudgetSchema =
    CreateBudgetSchema.safeParse(editBudgetFormData);

  if (!validatedEditBudgetSchema.success) {
    const errors = validatedEditBudgetSchema.error.issues.map(
      (error) => error.message,
    );
    return {
      success: "",
      errors,
      serverError: "",
    };
  }

  const token = getToken();
  if (!token) {
    redirect("auth/login");
  }

  const url = `${process.env.API_URL}/budgets/${budgetId}`;
  const request = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: validatedEditBudgetSchema.data.name,
      amount: validatedEditBudgetSchema.data.amount,
    }),
  });

  const json = await request.json();
  console.log(json);

  if (!request.ok || json.error) {
    const error = ErrorSchema.parse(json);
    return {
      success: "",
      errors: [],
      serverError: error.error,
    };
  }

  revalidatePath('/admin')
  const success = SuccessSchema.parse(json);

  return {
    success: success.message,
    errors: [],
    serverError: "",
  };
}
