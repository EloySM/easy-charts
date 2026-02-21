import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Dejar pasar rutas de auth sin procesar
  if (pathname.startsWith('/auth')) {
    return NextResponse.next()
  }

  const response = NextResponse.next({
    request: { headers: request.headers },
  })

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
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/signup'
  const isAppRoute = !isPublicRoute && !pathname.startsWith('/_next') && !pathname.includes('.')

  // Usuario logueado en ruta pública -> redirigir a /home
  if (user && isPublicRoute) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  // Usuario NO logueado en ruta protegida -> redirigir a /login
  if (!user && isAppRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}