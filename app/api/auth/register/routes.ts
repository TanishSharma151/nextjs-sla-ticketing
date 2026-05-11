import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type user = {
    name : string,
    email : string,
    password : string,
    role : "customer" | "agent" | "admin"
}

export async function POST(request : Request){
    const {name, email, password} = await request.json();

    if (!name || !email || !password){
        return NextResponse.json({message : "Required all fields", status : 400})
    }

    

}
