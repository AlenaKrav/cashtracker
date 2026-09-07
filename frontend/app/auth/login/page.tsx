import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

//muy util para el SEO
export const metadata: Metadata = {
  title: "CashTracker - Iniciar Sesión",
  description: "CashTracker - Iniciar Sesión",
};

export default function LoginPage() {
  return (
    <>
      <h1 className="font-black text-6xl text-purple-950">Inicia la sesión</h1>
      <p className="text-3xl font-bold">
        y controla tus <span className="text-amber-500">finanzas</span>
      </p>
      <LoginForm />
      <nav className="mt-6 flex flex-col space-y-4">
        <Link
          href="register" // tambien /auth/login
          className="text-center text-gray-500"
        >
          ¿No tienes cuenta? Regístrate aquí
        </Link>
        <Link
          href="forgot-password" // tambien /auth/login
          className="text-center text-gray-500"
        >
          Olvidé mi contraseña
        </Link>
      </nav>
    </>
  );
}
