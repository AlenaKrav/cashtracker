"use client";

import { ForgotPassword } from "@/actions/forgot-password-action";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


const initialState = {
  success: '',
  errors: [],
  serverError: ''
};

export default function ForgotPasswordForm() {
    const router = useRouter();
    const [state, dispatch] = useFormState(ForgotPassword, initialState);
    const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.errors) {
      state.errors.forEach((error) => {
        toast.error(error);
      });
    }
    if (state.success) {
      ref.current?.reset();
      toast.success(state.success, {
        onClose: () => {
          router.push("/auth/new-password");
        },
      });
      
    }
    if (state.serverError) {
      toast.error(state.serverError);
    }
  }, [state]);

    return (
        <form 
            ref={ref}
            className=" mt-14 space-y-5"
            noValidate
            action={dispatch}
        >
            <div className="flex flex-col gap-2 mb-10">
                <label
                className="font-bold text-2xl"
                >Email</label>
        
                <input
                    type="email"
                    placeholder="Email de Registro"
                    className="w-full border border-gray-300 p-3 rounded-lg"
                    name="email"
                />
            </div>
        
            <input 
                type="submit"
                value='Enviar Instrucciones'
                className="bg-purple-950 hover:bg-purple-800 w-full p-3 rounded-lg text-white font-black  text-xl cursor-pointer "
            />
        </form>
    )
}