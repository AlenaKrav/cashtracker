import { verifySession } from "@/src/auth/dal";
import getToken from "@/src/auth/token";

export async function GET(
  req: Request,
  { params }: { params: { budgetId: string; expenseId: string } },
) {
  const budgetId = params.budgetId;
  const expenseId = params.expenseId;

  await verifySession();
  const token = getToken();
  const url = `${process.env.API_URL}/budgets/${budgetId}/expenses/${expenseId}`;
  const request = await fetch(url, {
    headers: {
        'Authorization': `Bearear ${token}`
    }
  })

  const json = await request.json();

  if(!request.ok || json.error){
    return Response.json(json.error)
  }
  // console.log(json)
  return Response.json(json);
}
