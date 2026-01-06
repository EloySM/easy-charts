// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { email, password, next = "/home" } = await req.json();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return new Response(error?.message || "Credenciales inválidas", { status: 401 });
  }
  return NextResponse.redirect(new URL(next, req.url)); // 👈 redirect real
}
