//componente que según el estado muestra los cuadros para introducir el token o el formulario para un nuevo passw
"use client";

import { useState } from "react";
import ValidateTokenForm from "./ValidateTokenForm";
import ResetPasswordForm from "./ResetPasswordForm";

export default function PasswordResetHandler() {
  const [token, setToken] = useState("");
  const [isValidToken, setIsValidToken] = useState(false);
  return <>{!isValidToken ? 
  <ValidateTokenForm 
  setIsValidToken={setIsValidToken}
  token={token}
  setToken={setToken}
  /> : 
  <ResetPasswordForm 
    token={token}
  />}</>;
}
