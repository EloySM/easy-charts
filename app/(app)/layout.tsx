import type { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebarWithUser } from "@/components/app-sidebar-with-user"
import { ThemeProvider } from "@/components/theme-provider" 
import { SiteHeader } from "@/components/site-header";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Spency",
  description: "Administra tus gastos fácilmente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebarWithUser />
        
        <main className="@container/main w-full p-2 bg-sidebar">
          <div className="rounded-xl min-h-screen bg-background border">
            <Suspense fallback={<div>loading</div>}><SiteHeader/> </Suspense>
            
            <div className="p-6 md:p-8 lg:p-12">
              {children}
            </div>
          </div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}