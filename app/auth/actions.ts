'use server'

import { supabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

type AuthResponse = {
  error?: string;
  success?: boolean;
  message?: string;
}
export async function logout() {
  const supabase = await supabaseServer()
  
  // 1. Cerramos sesión en el servidor (borra cookies)
  await supabase.auth.signOut()
  
  // 2. Redirigimos al usuario
  redirect('/')
}

export async function login(formData: FormData): Promise<AuthResponse> {
  const supabase = await supabaseServer()

  // Extraemos los datos del formulario automáticamente
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function signup(formData: FormData): Promise<AuthResponse> {
  const supabase = await supabaseServer()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  // Simplemente disparamos el registro
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { 
      data: { 
        full_name: name } // Esto guarda el nombre en el metadato del usuario
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}