import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  const cookieStore = await cookies()
  
  // Crear respuesta de redirección a home
  const response = NextResponse.redirect(`${origin}/home`)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          // Solo modificar la respuesta, no el cookieStore
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Exchange error:', error)
      return NextResponse.redirect(`${origin}/login?error=exchange_failed`)
    }

    // Éxito - devolver respuesta con cookies seteadas
    return response
    
  } catch (err) {
    console.error('Exception:', err)
    return NextResponse.redirect(`${origin}/login?error=exception`)
  }
}