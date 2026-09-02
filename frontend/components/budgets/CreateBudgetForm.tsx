"use client";

import { createBudget } from "@/actions/create-budget-action";
import { useFormState } from "react-dom";
import ErrorMessage from "../ui/ErrorMessage";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import BudgetForm from "./BudgetForm";
import { Budget } from "@/src/schemas";

const initialState = {
  success: "",
  errors: [],
  serverError: "",
};

export default function CreateBudgetForm() {
  const [state, dispatch] = useFormState(createBudget, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
      router.push("/admin");
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
      />
      <input
        type="submit"
        className="bg-amber-500 w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
        value="Crear Presupuesto"
      />
    </form>
  );
}
