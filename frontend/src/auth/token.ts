import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function getToken(){
    const token = cookies().get("CASHTRACKER_TOKEN")?.value;
    if(!token){
        redirect("/auth/login");
    }
    return token
}