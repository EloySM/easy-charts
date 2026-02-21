"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { login } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>("");
  const router = useRouter();

  async function logInWithGoogle() {
      setLoading(true)
      const supabase = await createClient()
  
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `https://spency.app/auth/callback`
        }
      })
  
      if(error) {
        setError(error.message)
        setLoading(false)
      }
    }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await login(formData);

      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else if (result.success) {
        // Redirección controlada por el cliente
        router.push("/home");
        router.refresh();
      }
    } catch (err) {
      // Este catch ahora SÓLO atrapará errores reales (red, caída de servidor, etc.)
      setError("Error de conexión. Inténtalo de nuevo.");
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded text-sm mb-4 border border-red-200 dark:border-red-800">
                  {error}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
              </Field>

              <Field>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Logging in..." : "Login"}
                </Button>
                {/* Aquí podrías añadir un onClick para login con Google más tarde */}
                <Button variant="outline" type="button" disabled={loading} className="w-full" onClick={logInWithGoogle}>
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/signup" className="underline underline-offset-4">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}