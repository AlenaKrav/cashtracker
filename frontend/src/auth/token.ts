import { cookies } from "next/headers";

export default function getToken(){
    const token = cookies().get("CASHTRACKER_TOKEN")?.value;
    return token
}