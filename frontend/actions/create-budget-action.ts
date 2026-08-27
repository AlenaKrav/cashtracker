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

export async function createBudget(
  prevState: ActionStateType,
  formData: FormData,
) {

  const createBudgetFormData = {
    name: formData.get("name"),
    amount: formData.get("amount"),
  };

  const validatedCreateBudgetSchema =
    CreateBudgetSchema.safeParse(createBudgetFormData);

  if (!validatedCreateBudgetSchema.success) {
    const errors = validatedCreateBudgetSchema.error.issues.map(
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

  const url = `${process.env.API_URL}/budgets`;
  const request = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: validatedCreateBudgetSchema.data.name,
      amount: validatedCreateBudgetSchema.data.amount,
    }),
  });

  const json = await request.json();
  revalidatePath('/admin')
  console.log(json)

if(!request.ok || json.error){
    const error = ErrorSchema.parse(json);
    return {
      success: "",
      errors: [],
      serverError: error.error
    }
  }

  const success = SuccessSchema.parse(json);

  return {
    success: success.message,
    errors: [],
    serverError: ''
  };
}
