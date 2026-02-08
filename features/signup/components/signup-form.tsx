"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Field, FieldDescription, FieldGroup, FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signup } from "@/app/auth/actions"; // Importamos tu acción

export function SignupForm({ className, ...props }: React.ComponentProps<typeof Card>) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>("");
  const [isRegistered, setIsRegistered] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm-password") ?? "");

    // Validación básica en el cliente
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      // 🚀 Llamada a la Server Action (reemplaza al fetch)
      const result = await signup(form);

      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        // ✔ Éxito: Mostramos mensaje de confirmación de email
        setIsRegistered(true);
        setLoading(false);
      }
    } catch (err) {
      setError("Ocurrió un error inesperado al crear la cuenta");
      setLoading(false);
    }
  }

  // Si ya se registró, mostramos mensaje de "Revisa tu email"
  if (isRegistered) {
    return (
      <Card className={cn("w-full", className)} {...props}>
        <CardHeader>
          <CardTitle>¡Confirm your Email!</CardTitle>
          <CardDescription className="text-sm">
            We have sent a confirmation link to your email.
            Please check it to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => window.location.href = "/login"}>
            Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your information below to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <FieldGroup>
            {/* Visualización de errores */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded text-sm mb-4 border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input id="name" name="name" type="text" placeholder="John Doe" required disabled={loading} />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required disabled={loading} />
              <FieldDescription>
                We&apos;ll use this to contact you.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" name="password" type="password" required disabled={loading} />
              <FieldDescription>At least 8 characters long.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
              <Input id="confirm-password" name="confirm-password" type="password" required disabled={loading} />
            </Field>

            <div className="flex flex-col gap-3 mt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
              <Button variant="outline" type="button" disabled={loading}>
                Sign up with Google
              </Button>
              <p className="text-sm text-center text-muted-foreground mt-2">
                Already have an account? <a href="/login" className="underline underline-offset-4">Login</a>
              </p>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}