import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Mantenemos tu nombre "proxy" pero Next.js requiere exportar "middleware"
export async function proxy(request: NextRequest) {

  const response = NextResponse.next({ request })
  const pathname = request.nextUrl.pathname

  // SALIDA DE EMERGENCIA PARA AUTH
  if (pathname.startsWith('/auth')) {
    return response
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value) // Nota: request.cookies usa (name, value)
            response.cookies.set({ name, value, ...options })
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/signup'
  const isAppRoute = !isPublicRoute && !pathname.includes('.')

  if (user && isPublicRoute) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  if (!user && isAppRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}