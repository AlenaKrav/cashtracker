"use server";

import getToken from "@/src/auth/token";
import { Budget, ErrorSchema, Expense, SuccessSchema } from "@/src/schemas";
import { revalidatePath } from "next/cache";

type ActionStateType = {
  success: string;
  serverError: string;
  errors: string[];
};

type BudgetAndExpenseIdsTypes = {
  budgetId: Budget["id"];
  expenseId: Expense["id"];
};

export async function deleteExpense(
  { budgetId, expenseId }: BudgetAndExpenseIdsTypes,
  prevState: ActionStateType,
) {
  const token = getToken();
  const url = `${process.env.API_URL}/budgets/${budgetId}/expenses/${expenseId}`;
  const request = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
  revalidatePath(`/admin/budgets/${budgetId}`);

  return {
    success: success.message,
    serverError: "",
    errors: [],
  };
}
