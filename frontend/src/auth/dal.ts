import "server-only"; //ya que no es una server action, y 'use server' no nos sirve para que este codigo no vaya al cliente, lo forzamos con esta dependencia

// Data Access Layer = aqui revisamos si el user está autenticado
// En este caso no es una server action simplemente es una funcion del servidor
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authenticatedUser } from "../schemas";

// ya que vamos a llamar verifySession en varias ocasiones y diferentes lugares
// nos permite en vez de llamar la api para traer los datos, se reutilizarán si no han cambiado
export const verifySession = cache (async () => {
  const token = cookies().get("CASHTRACKER_TOKEN")?.value;
  if (!token) {
    redirect("auth/login");
  }

  const url = `${process.env.API_URL}/auth/user`;
  const request = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const session = await request.json();
  const verifiedSession = authenticatedUser.safeParse(session);

  //si la estructura del token no es valida (por ej es de otra web)
  if (!verifiedSession.success) {
    redirect("auth/login");
  }

  return {
    user: verifiedSession.data,
    isAuth: true, //creamos esta variable al pasar todos los pasos anteriores
  };
});
