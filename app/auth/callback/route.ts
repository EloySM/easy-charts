// app/auth/callback/route.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  // Determinamos el host real (localhost o spency.app)
  const host = request.headers.get('host')
  const protocol = host?.includes('localhost') ? 'http' : 'https'
  const siteUrl = `${protocol}://${host}`

  if (code) {
    const cookieStore = await cookies()
    
    // Creamos la respuesta hacia /home
    const response = NextResponse.redirect(`${siteUrl}/home`)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set({ name, value, ...options })
              response.cookies.set({ name, value, ...options }) // <--- VITAL
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

  // Si algo sale mal, forzamos login
  return NextResponse.redirect(`${siteUrl}/login?error=auth_callback_failed`)
}