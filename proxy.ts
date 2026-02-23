import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request })
  const pathname = request.nextUrl.pathname

  console.log('🔍 Middleware - Path:', pathname)

  // ✅ Permitir todas las rutas de auth sin restricciones
  if (pathname.startsWith('/auth')) {
    console.log('✅ Auth route - bypassing middleware')
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
  
  console.log('🔍 User:', user ? `✅ ${user.email}` : '❌ Not authenticated')
  console.log('🔍 Pathname:', pathname)

  const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/signup'
  const isAppRoute = !isPublicRoute && !pathname.includes('.') && !pathname.startsWith('/_next')

  // ✅ Si hay usuario y está en ruta pública, redirigir a home
  if (user && isPublicRoute) {
    console.log('🔀 Redirecting authenticated user from', pathname, 'to /home')
    return NextResponse.redirect(new URL('/home', request.url))
  }

  // ✅ Si no hay usuario y está en ruta privada, redirigir a login
  if (!user && isAppRoute) {
    console.log('🔀 Redirecting unauthenticated user from', pathname, 'to /login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  console.log('✅ Allowing request to proceed')
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}