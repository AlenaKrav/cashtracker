"use server";

import { ErrorSchema, RegisterSchema, SuccessSchema } from "@/src/schemas";

type ActionStateType = {
  success: string,
  serverError: string,
  errors: string[]
};

export async function Register(
  prevState: ActionStateType,
  formData: FormData,
) {
  // recibir el formulario
  const registerFormData = {
    email: formData.get("email"),
    name: formData.get("name"),
    password: formData.get("password"),
    password_confirmation: formData.get("password_confirmation"),
  };

  // validar
  const validatedRegister = RegisterSchema.safeParse(registerFormData);
  // console.log("RESULTADO VALIDACIÓN DE CAMPOS DEL FORM", validatedRegister);


  if (!validatedRegister.success) {
    const errors = validatedRegister.error.issues.map((error) => error.message);
    return {
      success: "",
      errors,
      serverError: ""
    };
  }

  // registrar al user
  const url = `${process.env.API_URL}/auth/create-account`;
  const request = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: validatedRegister.data.name,
      password: validatedRegister.data.password,
      email: validatedRegister.data.email,
    }),
  });

  //ESTO ES LO QUE NOS DEVUELVE EL SERVER (MENSAJE DE SUCCES O CON EL ERROR)
  const json = await request.json();
  // console.log('JSON DEL REQUEST', json);

 

  if(json.error){
    const error = ErrorSchema.parse(json);
    // console.log("ESTE ES UN MENSAJE DE ERROR", error.error);
    return {
      success: "",
      errors: [],
      serverError: error.error
    }
  }

   
  const success = SuccessSchema.parse(json);
  // console.log("ESTE ES UN SUCCESS", success.message);

  return {
    success: success.message,
    errors: [],
    serverError: ''
  };
}
