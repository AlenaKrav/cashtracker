"use server";

import { ErrorSchema, ForgotPasswordSchema, SuccessSchema } from "@/src/schemas";

type ActionStateType = {
  success: string;
  serverError: string;
  errors: string[];
};

export async function ForgotPassword(
  prevState: ActionStateType,
  formData: FormData,
) {
  console.log("Desde forgot password");
  console.log(formData);

  const resetPasswordFormData = {
    email: formData.get("email"),
  };

  const forgotPassword = ForgotPasswordSchema.safeParse(resetPasswordFormData);
  

  if (!forgotPassword.success) {
    const errors = forgotPassword.error.issues.map((error) => error.message);
    console.log(errors)
    return {
      success: "",
      errors,
      serverError: "",
    };
    
  }


  const url = `${process.env.API_URL}/auth/forgot-password`;
  const request = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: forgotPassword.data.email,
    }),
  });

  //ESTO ES LO QUE NOS DEVUELVE EL SERVER (MENSAJE DE SUCCES O CON EL ERROR)
  const json = await request.json();
  console.log('JSON DEL REQUEST', json);

 

  if(json.error){
    const error = ErrorSchema.parse(json);
    console.log("ESTE ES UN MENSAJE DE ERROR", error.error);
    return {
      success: "",
      errors: [],
      serverError: error.error
    }
  }

   
  const success = SuccessSchema.parse(json);
  console.log("ESTE ES UN SUCCESS", success.message);

  return {
    success: success.message,
    errors: [],
    serverError: ''
  };
}
