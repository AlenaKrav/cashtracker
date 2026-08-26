"use client";

import React, { useEffect } from 'react'
import BudgetForm from './BudgetForm';
import { Budget } from '@/src/schemas';
import { useFormState } from 'react-dom';
import { editBudget } from '@/actions/edit-budget-action';
import { toast } from 'react-toastify';
import ErrorMessage from '../ui/ErrorMessage';
import { useRouter } from 'next/navigation';

const initialState = {
  success: "",
  errors: [],
  serverError: "",
};

export default function EditBudgetForm({budget}: {budget: Budget}) {
  const id = budget.id;
  const editBudgetWithId = editBudget.bind(null, id)
  const [state, dispatch] = useFormState(editBudgetWithId, initialState);
  const router = useRouter();

    useEffect(() => {
    if (state.success) {
      toast.success(state.success)
          router.push("/admin")
    }
      if (state.serverError) {
        toast.error(state.serverError);
      }
    }, [state]);


  return (
    <form className="mt-10 space-y-3" noValidate action={dispatch}>
      {state.errors.map((error) => (
        <ErrorMessage key={error}>{error}</ErrorMessage>
      ))}
      <BudgetForm
        budget={budget} 
      />
      <input
        type="submit"
        className="bg-amber-500 w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
        value="Actualizar presupuesto"
      />
    </form>
  )
}
