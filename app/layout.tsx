// app/layout.tsx
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { metadata as appMetadata } from "@/lib/metadata"; // ← Importa tu metadata
import { Metadata } from "next";

// Re-exporta para que Next.js lo use
export const metadata: Metadata = appMetadata;
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap', // Mejora performance
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}