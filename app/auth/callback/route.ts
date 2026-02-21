import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Forzamos el destino a /home para asegurar que no te mande a la landing
  const next = '/home' 

  if (code) {
    const cookieStore = await cookies()
    
    // IMPORTANTE: Creamos la respuesta de redirección PRIMERO
    const response = NextResponse.redirect(`${origin}${next}`)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            // Seteamos las cookies en el store y en la respuesta que vamos a enviar
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set({ name, value, ...options })
              response.cookies.set({ name, value, ...options })
            })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return response // Devolvemos la respuesta que ya lleva las cookies inyectadas
    }
  }

  // Si algo falla, al error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}