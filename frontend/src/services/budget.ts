import { cache } from "react";
import getToken from "../auth/token";
import { notFound } from "next/navigation";
import { BudgetAPIResponseSchema } from "../schemas";

export const getBudgetById = cache(async (budgetId: string) => {
  const token = getToken();
  const url = `${process.env.API_URL}/budgets/${budgetId}`;
  const request = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await request.json();
  // console.log(json);

  if (!request.ok || json.error) {
    notFound(); //mostrará un 404 por defecto de next o el componente ppio not-found.tsx
  }

  const budget = BudgetAPIResponseSchema.parse(json);
  return budget;
});
