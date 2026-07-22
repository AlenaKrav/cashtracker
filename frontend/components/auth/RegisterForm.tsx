"use client";

import { Register } from "@/actions/create-account-action";
import { useFormState } from "react-dom";
import ErrorMessage from "../ui/ErrorMessage";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

const initialState = {
  success: '',
  errors: [],
  serverError: ''
};

export default function RegisterForm() {
  const [state, dispatch] = useFormState(Register, initialState);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(()=> {
    if(state.success) {
      toast.success(state.success)
      ref.current?.reset()
    }
  if (state.serverError) {
        toast.error(state.serverError)
    }
  }, [state])
  
  console.log("Estado del fomrulario", state);

  return (
    <form 
    ref={ref}
    className="mt-14 space-y-5" 
    noValidate action={dispatch}>
      {/* SI HAY ERRORES DE VALIDACION DE ZOD */}
      {state.errors.map((error) => (
        <ErrorMessage>{error}</ErrorMessage>
      ))}
      <div className="flex flex-col gap-2">
        <label className="font-bold text-2xl" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Email de Registro"
          className="w-full border border-gray-300 p-3 rounded-lg"
          name="email"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold text-2xl">Nombre</label>
        <input
          type="name"
          placeholder="Nombre de Registro"
          className="w-full border border-gray-300 p-3 rounded-lg"
          name="name"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold text-2xl">Password</label>
        <input
          type="password"
          placeholder="Password de Registro"
          className="w-full border border-gray-300 p-3 rounded-lg"
          name="password"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold text-2xl">Repetir Password</label>
        <input
          id="password_confirmation"
          type="password"
          placeholder="Repite Password de Registro"
          className="w-full border border-gray-300 p-3 rounded-lg"
          name="password_confirmation"
        />
      </div>

      <input
        type="submit"
        value="Registrarme"
        className="bg-purple-950 hover:bg-purple-800 w-full p-3 rounded-lg text-white font-black  text-xl cursor-pointer block"
      />
    </form>
  );
}
