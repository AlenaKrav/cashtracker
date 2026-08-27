import AddExpenseButton from "@/components/expenses/AddExpenseButton";
import ModalContainer from "@/components/ui/ModalContainer";
import { getBudgetById } from "@/src/services/budget";
import { Metadata } from "next";


export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const budget = await getBudgetById(params.id);

  return {
    title: `Viendo el presupuesto - ${budget.name}`,
  };
}

export default async function budgetPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const budget = await getBudgetById(id);
//   console.log(budget);
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-black text-4xl text-purple-950">{budget.name}</h1>
          <p className="text-xl font-bold">
            Administra tus {""} <span className="text-amber-500">gastos</span>
          </p>
        </div>
        <AddExpenseButton />
      </div>
      <ModalContainer />
    </>
  );
}
