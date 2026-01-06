import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { email, password, full_name } = await req.json();
    if (!email || !password || !full_name) {
      return new Response("Faltan campos", { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name } }, // queda en user_metadata (BD: raw_user_meta_data)
    });

    if (error || !data.user) {
      return new Response(error?.message || "No se pudo crear el usuario", { status: 400 });
    }

    return NextResponse.json({ ok: true, userId: data.user.id });
  } catch {
    return new Response("Error inesperado", { status: 500 });
  }
}
