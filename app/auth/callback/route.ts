// app/auth/callback/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
// 1. Importa directamente desde el paquete de SSR para evitar conflictos
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = await cookies()
    
    // 2. Crea el cliente aquí mismo para asegurar que maneja las cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
    
    // 3. Intercambia el código por la sesión
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 4. Importante: Usa el 'origin' para asegurar que la redirección es absoluta
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Si hay error, redirige a una página de error
  return NextResponse.redirect(`${origin}/auth/auth-error`)
}