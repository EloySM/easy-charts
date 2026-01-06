// components/UserProfile.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

export function UserProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Obtener usuario inicial
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    // ✅ Suscribirse a cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  if (loading) return <div>Cargando...</div>
  if (!user) return <div>No autenticado</div>

  const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario'

  return (
    <div>
      <h2>Perfil</h2>
      <p>Nombre: {userName}</p>
      <p>Email: {user.email}</p>
    </div>
  )
}