// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // --- CONFIGURACIÓN DE RUTAS ---
  
  // Rutas públicas (lo que está en (public))
  const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/signup'
  
  // Rutas de la aplicación (lo que está en (app))
  // Como están protegidas, verificamos si el pathname NO es público y no es un archivo
  const isAppRoute = !isPublicRoute && !pathname.includes('.')

  // 1. Si está logueado y trata de ir a una ruta pública (Landing, Login, Signup) -> al Home
  if (user && isPublicRoute) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  // 2. Si NO está logueado y trata de ir a cualquier ruta que no sea pública -> al Login
  if (!user && isAppRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  // El matcher debe excluir archivos estáticos y la ruta de confirmación de auth
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}