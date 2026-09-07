"use client";

import { DialogTitle } from "@headlessui/react";
import ExpenseForm from "./ExpenseForm";
import { useFormState } from "react-dom";
import { createExpense } from "@/actions/create-expense-action";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect } from "react";

const initialState = {
  success: "",
  errors: [],
  serverError: "",
};

export default function AddExpenseForm({closeModal} : {closeModal :() => void}) {
  const {id} = useParams(); //asi es como podemos recuperar los parametros en un CC
  const createExpenseWithBudgetId = createExpense.bind(null, +id);
  const [state, dispatch] = useFormState(createExpenseWithBudgetId, initialState);



    useEffect(() => {
      if (state.errors) {
        state.errors.forEach((error) => {
          toast.error(error);
        });
      }
      if (state.success) {
        toast.success(state.success);
        closeModal()
      }
      if (state.serverError) {
        toast.error(state.serverError);
      }
    }, [state, closeModal]);



  return (
    <>
      <DialogTitle
        as="h3"
        className="font-black text-4xl text-purple-950 my-5"
      >
        Agregar Gasto
      </DialogTitle>

      <p className="text-xl font-bold">Llena el formulario y crea un {''}
        <span className="text-amber-500">gasto</span>
      </p>
      <form
        className="bg-gray-100 shadow-lg rounded-lg p-10 mt-10 border"
        noValidate
        action={dispatch}
      >
        <ExpenseForm />
        <input
          type="submit"
          className="bg-amber-500 w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
          value='Registrar Gasto'
        />
      </form>
    </>
  )
}