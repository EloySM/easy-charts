import { supabaseServer } from '@/lib/supabase/server'
// import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestURL = new URL(request.url)
  const code = requestURL.searchParams.get('code')
  
  if (code) {
    const supabase = await supabaseServer()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if(error) {
      console.error(`Error swapping code: ${error.message}`)

      return NextResponse.redirect(
        `${requestURL.origin}/login?error=auth_failed`
      )
    }

    return NextResponse.redirect(`${requestURL.origin}/home`)
  }

  return NextResponse.redirect(`${requestURL.origin}/login?error=callback_failed`)
}