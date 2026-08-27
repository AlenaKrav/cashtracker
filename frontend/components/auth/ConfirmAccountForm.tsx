"use client";

import { ConfirmAccount } from "@/actions/confirm-account-action";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import ErrorMessage from "../ui/ErrorMessage";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


const initialState = {
  success: '',
  errors: [],
  serverError: ''
};

export default function ConfirmAccountForm() {
  const router = useRouter();
  const [isComplete, setIsComplete] = useState(false);
  const [token, setToken] = useState("");
  /** Con bind() creamos una nueva función basada en ConfirmAccount, 
   * donde el primer argumento (token) queda fijado. 
   * Por esto al modificar server action confirmAccount token aparece como 1º param */
  const confirmAccountWithToken = ConfirmAccount.bind(null, token); //null ocupa el lugar de this que es un parametro que no usamos en nuestro caso
  const [state, dispatch] = useFormState(confirmAccountWithToken, initialState);

  useEffect(() => {
    if (isComplete) {
      dispatch();
    }
  }, [isComplete]);


  useEffect(() => {
    if (state.serverError) {
        toast.error(state.serverError)
    }
    if (state.success) {
      toast.success(state.success);
      router.push("/auth/login");
    }
  }, [state]);

  //Puede ocurrir que handleChange reciba los 6 digitos pero handleComplete no, ya que React no actualiza el token inmediatamente
  const handleChange = (token: string) => {
    //es necesario para que vuelva a mandar la peticion para confirmar token cada vez que borremos y volvamos a escribir el token
    setIsComplete(false);  //cada vez que se detecta cambios isComplete es false, hasta que se ejecute handleComplete
    setToken(token);
  };

  const handleComplete = () => {
    //por eso seteamos esa variable que al cambiarse dispara dispatch
    //pero si una vez introducido el token no valido de 6 digitos esto se seta como true
    //por lo que si borramos digitos y volvemos a introducir token correcto ya no vuelve a mandar la peticion
    setIsComplete(true); 
  };

  return (
    <>
    {state.errors.map(error => <ErrorMessage>{error}</ErrorMessage>)}
    <div className="flex justify-center gap-5 my-10">

      <PinInput
        value={token} //este es el valor de token que pasamos a handleCHange
        onChange={handleChange}
        onComplete={handleComplete}
      >
        <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg text-center placeholder-white" />
        <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg text-center placeholder-white" />
        <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg text-center placeholder-white" />
        <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg text-center placeholder-white" />
        <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg text-center placeholder-white" />
        <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg text-center placeholder-white" />
      </PinInput>
    </div>
    </>
  );
}
