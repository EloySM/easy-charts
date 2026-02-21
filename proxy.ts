// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const pathname = request.nextUrl.pathname

  // --- 1. EXCEPCIÓN DE RUTAS DE AUTH ---
  // Permitir que las rutas de autenticación pasen sin validación
  // Esto incluye /auth/callback donde se procesa el login de Google
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
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: Refrescar la sesión antes de obtener el usuario
  // Esto asegura que las cookies se procesen correctamente
  const { data: { session } } = await supabase.auth.getSession()
  const { data: { user } } = await supabase.auth.getUser()

  // --- 2. CONFIGURACIÓN DE REDIRECCIONES ---
  
  // Rutas públicas que no requieren autenticación
  const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/signup'
  
  // Rutas protegidas de la aplicación
  const isAppRoute = !isPublicRoute && !pathname.startsWith('/_next') && !pathname.includes('.')

  // REGLA A: Usuario logueado en ruta pública -> redirigir a /home
  if (user && isPublicRoute) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  // REGLA B: Usuario no logueado en ruta protegida -> redirigir a /login
  if (!user && isAppRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /**
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}