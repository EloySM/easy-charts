// app/(landing-page)/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-5xl font-bold">
          Bienvenido a Mi App de Gastos
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Administra tus gastos de forma simple y efectiva
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button asChild size="lg">
            <Link href="/login">Iniciar sesión</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/signup">Registrarse</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}