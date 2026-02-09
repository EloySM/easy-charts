import type { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebarWithUser } from "@/components/app-sidebar-with-user"
import { ThemeProvider } from "@/components/theme-provider" 
import { SiteHeader } from "@/components/site-header";

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
        
        <main className="w-full p-2 bg-[#171717]">
          <div className="rounded-xl min-h-[calc(100vh)] bg-background border">
            <SiteHeader/>
            
            <div className="p-6 md:p-8 lg:p-12">
              {children}
            </div>
          </div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}