import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // En producción usamos /home, en local también
  const next = '/home'

  if (code) {
    const cookieStore = await cookies()
    
    // 1. Creamos la respuesta de redirección primero
    const response = NextResponse.redirect(`${origin}${next}`)

    // 2. Creamos el cliente vinculado a esa respuesta específica
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Seteamos en el store y en la respuesta (VITAL para Vercel)
              cookieStore.set({ name, value, ...options })
              response.cookies.set({ name, value, ...options })
            })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return response
    }
  }

  // Si algo falla, volvemos al login con error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}