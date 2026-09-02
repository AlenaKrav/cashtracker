"use server";

import getToken from "@/src/auth/token";
import { Budget, CreateExpenseSchema, ErrorSchema, Expense, SuccessSchema } from "@/src/schemas";
import { revalidatePath } from "next/cache";

type BudgetAndExpenseIdsTypes = {
  budgetId: Budget['id'];
  expenseId: Expense['id'];
};

type ActionStateType = {
  success: string;
  serverError: string;
  errors: string[];
};

export async function EditExpense(
  { budgetId, expenseId }: BudgetAndExpenseIdsTypes,
  prevState: ActionStateType,
  formData: FormData,
) {
  const EditExpenseFormData = {
    name: formData.get("name"),
    amount: formData.get("amount"),
  };

  const validatedEditExpenseFormData =
    CreateExpenseSchema.safeParse(EditExpenseFormData);

  if (!validatedEditExpenseFormData.success) {
    const errors = validatedEditExpenseFormData.error.issues.map(
      (error) => error.message,
    );
    return {
      success: "",
      errors,
      serverError: "",
    };
  }

  const token = getToken();

  const url = `${process.env.API_URL}/budgets/${budgetId}/expenses/${expenseId}`;
  const request = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: validatedEditExpenseFormData.data.name,
      amount: validatedEditExpenseFormData.data.amount,
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

  const success = SuccessSchema.parse(json);
  revalidatePath(`/admin/budgets/${budgetId}`)

  return {
    success: success.message,
    errors: [],
    serverError: "",
  };
}
