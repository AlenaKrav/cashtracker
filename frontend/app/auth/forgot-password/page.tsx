import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";
import LoginForm from "@/components/auth/LoginForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import Link from "next/link";

//muy util para el SEO
export const metadata: Metadata = {
  title: "CashTracker - Olvidé mi contraseña",
  description: "CashTracker - Olvidé mi contraseña",
};

export default function ForgorPasswordPage() {
  return (
    <>
      <h1 className="font-black text-6xl text-purple-950">
        ¿Olvidaste tu contraseña?
      </h1>
      <p className="text-3xl font-bold">
        Aquí puedes <span className="text-amber-500">restablecerla</span>
      </p>
      <ForgotPasswordForm />
      <nav className="mt-6 flex flex-col space-y-4">
        <Link
          href="login" // tambien /auth/login
          className="text-center text-gray-500"
        >
          ¿Ya tienes un cuenta? Inicia tu sesión aquí
        </Link>
        <Link
          href="register" // tambien /auth/login
          className="text-center text-gray-500"
        >
          ¿No tienes cuenta? Regístrate aquí
        </Link>
      </nav>
    </>
  );
}
