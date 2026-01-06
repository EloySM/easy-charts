// app/(public)/layout.tsx
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Cliente de Supabase del lado servidor (usa tus cookies del App Router)
  const supabase = await supabaseServer();

  // ¿Hay sesión activa?
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Si ya está logueado, sácalo de las páginas públicas
  if (session) {
    redirect("/home"); // o la ruta privada que prefieras
  }

  // Si NO hay sesión, renderiza normalmente las páginas públicas
  return <>{children}</>;
}
