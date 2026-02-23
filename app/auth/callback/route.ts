// app/auth/callback/route.ts
import { supabaseServer } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestURL = new URL(request.url)
  const code = requestURL.searchParams.get('code')
  
  console.log('====== AUTH CALLBACK ======')
  console.log('🔍 URL:', requestURL.href)
  console.log('🔍 Code:', code)
  
  if (code) {
    const supabase = await supabaseServer()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    console.log('🔍 Session:', data?.session ? '✅ Created' : '❌ Failed')
    console.log('🔍 User:', data?.user?.email)
    console.log('🔍 Error:', error?.message)

    if (error) {
      console.error(`❌ Error: ${error.message}`)
      return NextResponse.redirect(`${requestURL.origin}/login?error=auth_failed`)
    }

    console.log('✅ Redirecting to /home')
    const redirectUrl = `${requestURL.origin}/home`
    console.log('🔗 Redirect URL:', redirectUrl)
    
    return NextResponse.redirect(redirectUrl)
  }

  console.log('❌ No code')
  return NextResponse.redirect(`${requestURL.origin}/login?error=callback_failed`)
}