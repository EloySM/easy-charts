import { supabaseServer } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // 1. Extraemos el código de la URL y la dirección a donde queremos ir
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // 'next' es a donde queremos ir tras confirmar (por defecto /home)
  const next = searchParams.get('next') ?? '/home'

  if (code) {
    const supabase = await supabaseServer()
    
    // 2. Intercambiamos el código por una sesión activa
    // Esto guarda las cookies de sesión en el navegador automáticamente
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 3. Si todo ok, redirigimos a /home
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Si algo falla (código inválido o error), mandamos a una página de error o al login
  return NextResponse.redirect(`https://spency.app/login?error=No se pudo verificar la cuenta`)
}