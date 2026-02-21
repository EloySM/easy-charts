// app/auth/callback/route.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/home'
  const baseUrl = 'https://spency.app'

  if (code) {
    const cookieStore = await cookies()
    
    // Creamos la respuesta primero para poder vincularle las cookies
    const response = NextResponse.redirect(`${baseUrl}${next}`)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            // Seteamos las cookies tanto en el store como en la respuesta de redirección
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
      return response // Retornamos la respuesta que ya lleva las cookies inyectadas
    }
  }

  return NextResponse.redirect(`${baseUrl}/auth/auth-error`)
}