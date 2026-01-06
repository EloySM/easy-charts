// proxy.ts
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/session";

export async function proxy(req: NextRequest) {
  // Solo sincroniza/renueva la sesión de Supabase.
  // NO hagas aquí lógica de “si no hay sesión redirige…”
  // (la haremos por layout/página para evitar bucles)
  const { supabaseResponse } = await updateSession(req);
  return supabaseResponse;
}

export const config = {
  matcher: [
    // pásalo por casi todo menos assets
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
