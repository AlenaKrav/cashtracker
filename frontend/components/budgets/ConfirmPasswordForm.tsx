"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { DialogTitle } from "@headlessui/react";
import { useFormState } from "react-dom";
import { deleteBudget } from "@/actions/delete-budget-action";
import { useEffect } from "react";
import { toast } from "react-toastify";

const initialState = {
  success: "",
  errors: [],
  serverError: "",
};

export default function ConfirmPasswordForm() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const budgetId = +searchParams.get("deleteBudgetId")!; //+ es un operador de JS que convierte el valor a numero

  const deleteBudgetWithPassword = deleteBudget.bind(null, budgetId);
  const [state, dispatch] = useFormState(
    deleteBudgetWithPassword,
    initialState,
  );

  const closeModal = () => {
    const hideModal = new URLSearchParams(searchParams.toString());
    hideModal.delete("deleteBudgetId");
    router.replace(`${pathname}?${hideModal}`);
  };

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
      <DialogTitle as="h3" className="font-black text-4xl text-purple-950 my-5">
        Eliminar Presupuesto
      </DialogTitle>
      <p className="text-2xl font-bold">
        Ingresa tu Password para {""}
        <span className="text-amber-500">eliminar el presupuesto {""}</span>
      </p>
      <p className="text-gray-600 text-sm">
        (Un presupuesto eliminado y sus gastos no se pueden recuperar)
      </p>
      <form className=" mt-6 space-y-5" noValidate action={dispatch}>
        <input
          id="password"
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-3 rounded-lg"
          name="password"
        />
        <div className="grid grid-cols-2 gap-5">
          <input
            type="submit"
            value="Eliminar Presupuesto"
            className="bg-purple-950 hover:bg-purple-800 w-full p-3 rounded-lg text-white font-black cursor-pointer transition-colors"
          />
          <button
            className="bg-amber-500 hover:bg-amber-600 w-full p-3 rounded-lg text-white font-black cursor-pointer transition-colors"
            onClick={closeModal}
          >
            Cancelar
          </button>
        </div>
      </form>
    </>
  );
}
