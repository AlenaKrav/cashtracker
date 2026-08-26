import type { Metadata } from "next";
import Link from "next/link";
import EditBudgetForm from "@/components/budgets/EditBudgetForm";
import { getBudgetById } from "@/src/services/budget";

//esta es una funcion de next, nosotros la generamos y next la reconoce
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const budget = await getBudgetById(params.id);

  return {
    title: `Editando ${budget.name}`,
  };
}

//como este componente es un SC y no CC, no es necesario que invoque un SA, por ello lo convertimos en un compoenente async
export default async function EditBudgetPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const budget = await getBudgetById(id);
  return (
    <>
      <div className="flex flex-col-reverse md:flex-row md:justify-between items-center">
        <div className="w-full md:w-auto">
          <h1 className="font-black text-4xl text-purple-950 my-5">
            Editar Presupuesto: {budget.name}
          </h1>
          <p className="text-xl font-bold">
            <span>Llena el formulario para editar este </span>
            <span className="text-amber-500">presupuesto</span>
          </p>
        </div>
        <Link
          href={"/admin"}
          className="bg-amber-500 p-2 rounded-lg text-white font-bold w-full md:w-auto text-center"
        >
          Volver
        </Link>
      </div>
      <div className="p-10 mt-10 shadow-lg border ">
        <EditBudgetForm budget={budget} />
      </div>
    </>
  );
}
