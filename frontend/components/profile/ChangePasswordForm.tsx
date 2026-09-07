"use client";

import { updateUserPassword } from "@/actions/update-password-action";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";

const initialState = {
  success: "",
  errors: [],
  serverError: "",
};

export default function ChangePasswordForm() {
  const [state, dispatch] = useFormState(updateUserPassword, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.errors) {
      state.errors.forEach((error) => {
        toast.error(error);
      });
    }
    if (state.success) {
      toast.success(state.success, {
        onClose: () => router.push("/auth/login"),
      });
    }
    if (state.serverError) {
      toast.error(state.serverError);
    }
  }, [state]);

  return (
    <>
      <form className=" mt-14 space-y-5" noValidate action={dispatch}>
        <div className="flex flex-col gap-5">
          <label className="font-bold text-2xl" htmlFor="current_password">
            Password Actual
          </label>
          <input
            id="current_password"
            type="password"
            placeholder="Password Actual"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="current_password"
          />
        </div>
        <div className="flex flex-col gap-5">
          <label className="font-bold text-2xl" htmlFor="password">
            Nuevo Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Nuevo password"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="password"
          />
        </div>
        <div className="flex flex-col gap-5">
          <label htmlFor="password_confirmation" className="font-bold text-2xl">
            Repetir Nuevo Password
          </label>

          <input
            id="password_confirmation"
            type="password"
            placeholder="Repite nuevo password"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="password_confirmation"
          />
        </div>

        <input
          type="submit"
          value="Cambiar Password"
          className="bg-purple-950 hover:bg-purple-800 w-full p-3 rounded-lg text-white font-black  text-xl cursor-pointer"
        />
      </form>
    </>
  );
}
