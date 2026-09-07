import { DialogTitle } from "@headlessui/react";
import ExpenseForm from "./ExpenseForm";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { DraftExpense } from "@/src/schemas";
import { useFormState } from "react-dom";
import { EditExpense } from "@/actions/edit-expense-action";
import { toast } from "react-toastify";


const initialState = {
  success: "",
  errors: [],
  serverError: "",
};

export default function EditExpenseForm({ closeModal }: { closeModal: () => void }) {
  const {id: budgetId} = useParams(); //budgetId
  const searchParams = useSearchParams(); //showModal=true&editExpenseId=18
  const expenseId = searchParams.get('editExpenseId')!;
  
  const editExpenseWithIds = EditExpense.bind(null, {
    budgetId: +budgetId,
    expenseId: +expenseId
  })
  const [state, dispatch] = useFormState(editExpenseWithIds, initialState)
  const [expense, setExpense] = useState<DraftExpense>();
  
  //cuando el componente se monta se hace el fetch y se pasa el data hacia el componente hijo
  useEffect(() => {
    //nos conectamos con la rest API de express
    const url = `${process.env.NEXT_PUBLIC_URL}/admin/api/budgets/${budgetId}/expenses/${expenseId}`
    fetch(url)
    .then(res => res.json())
    .then(data => setExpense(data))
  }, [budgetId, expenseId]);

      useEffect(() => {
      if (state.success) {
        toast.success(state.success)
        closeModal()
      }
        if (state.serverError) {
          toast.error(state.serverError);
        }
      }, [state, closeModal]);


  if(!expense){
     return <p className="text-center text-gray-600">Cargando gasto...</p>
  };


  

  return (
    <>
      <DialogTitle
        as="h3"
        className="font-black text-4xl text-purple-950 my-5"
      >
        Editar Gasto
      </DialogTitle>
      <p className="text-xl font-bold">Edita los detalles de un {''}
        <span className="text-amber-500">gasto</span>
      </p>
      <form
        className="bg-gray-100 shadow-lg rounded-lg p-10 mt-10 border"
        noValidate
        action={dispatch}
      >
        <ExpenseForm expense={expense}/>

        <input
          type="submit"
          className="bg-amber-500 w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
          value='Guardar Cambios'
        />
      </form>
    </>
  )
}