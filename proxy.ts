import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request })
  const pathname = request.nextUrl.pathname

  // ✅ Permitir todas las rutas de auth sin restricciones
  if (pathname.startsWith('/auth')) {
    return response
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { 
          return request.cookies.getAll() 
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set({ name, value, ...options })
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/signup'
  const isAppRoute = !isPublicRoute && !pathname.includes('.')

  // ✅ Si hay usuario y está en ruta pública, redirigir a home
  if (user && isPublicRoute) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  // ✅ Si no hay usuario y está en ruta privada, redirigir a login
  if (!user && isAppRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}