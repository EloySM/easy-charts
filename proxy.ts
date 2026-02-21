// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Función Proxy para gestionar la sesión y las redirecciones.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const pathname = request.nextUrl.pathname

  // --- 1. EXCEPCIÓN DE RUTA DE AUTH ---
  // Si la ruta es de autenticación, dejamos pasar la petición sin validar usuario.
  // Esto evita que el código de Google (?code=...) rebote a la landing.
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

  // Obtenemos el usuario actual
  const { data: { user } } = await supabase.auth.getUser()

  // --- 2. CONFIGURACIÓN DE REDIRECCIONES ---
  
  // Definimos qué es una ruta pública
  const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/signup'
  
  // Definimos qué es una ruta de la App (protegida)
  // Ignoramos archivos con punto (.) y rutas de sistema de Next (_next)
  const isAppRoute = !isPublicRoute && !pathname.startsWith('/_next') && !pathname.includes('.')

  // REGLA A: Si el usuario ya está logueado y trata de ir a Login/Landing -> Enviarlo a /home
  if (user && isPublicRoute) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  // REGLA B: Si NO hay usuario y trata de entrar a la App -> Enviarlo al Login
  if (!user && isAppRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

/**
 * Configuración del Matcher para que Next.js ejecute la función proxy.
 * Aunque uses el nombre 'proxy', Next.js requiere exportar 'middleware' por defecto
 * o configurar el motor para que lo reconozca. Si tu framework busca 'proxy', aquí está:
 */
export const middleware = proxy; 

export const config = {
  matcher: [
    /*
     * Excluimos explícitamente rutas estáticas y el callback de auth
     * para que el proceso de Google sea fluido.
     */
    '/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}