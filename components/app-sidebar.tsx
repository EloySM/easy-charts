"use client"

import * as React from "react"
import { 
  Home, 
  Banknote, 
  Blocks, 
  ChartPie, 
  Sparkles, 
  Settings,
  Plus, // Importamos Plus para un "Quick Create" más estándar si prefieres
  CirclePlus,
  Sparkle
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator, // Útil para dividir secciones
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SpencyDark } from "@/public/spency"
import { Button } from "./ui/button"

const data = {
  navMain: [
    { title: "Home", url: "/home", icon: Home },
    { title: "Categories", url: "/categories", icon: Blocks },
    { title: "Expenses", url: "/expenses", icon: Banknote },
  ],
  navAnalytics: [
    { title: "Data Dashboard", url: "/data-dashboard", icon: ChartPie },
    { title: "AI Assistant", url: "/ai", icon: Sparkles },
  ],
  navSecondary: [
    { title: "Settings", url: "/settings", icon: Settings },
  ]
}

type User = { name: string; email: string; avatar: string }

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & { user: User }) {
  const pathname = usePathname()

  return (
    // Por defecto tiene bordes sidebar pero con className='border-none' se le quitan
    <Sidebar collapsible="offcanvas" className="border-none" {...props}> 
      <SidebarHeader className="pt-4">
        <SidebarMenu>
          {/* Logo Section */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg" // Aumentamos el tamaño del contenedor del logo
              className="hover:bg-transparent" // El logo no debería parecer un botón de acción
            >
              <Link href="/" className="flex justify-start">
                <div className="flex items-center">
                  <SpencyDark className="size-6" />
                </div>
                <span className="text-xl font-bold">Spency</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Quick Create Button */}
          <SidebarMenuItem className="mt-4">
            <Link href="/categories/new-category" className="w-full">
              <Button 
                variant="default"
                size="sm"
                className="w-full justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <Sparkles className="fill-primary text-primary-foreground" />
                <span className="font-bold">Quick create</span>
              </Button>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu className="gap-1"> {/* Añadido gap entre items para que no estén pegados */}
          {/* Sección Principal */}
          {data.navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                <Link href={item.url}>
                  <item.icon className="size-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <SidebarSeparator className="my-2 mx-2" />

          {/* Sección Analytics */}
          {data.navAnalytics.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                <Link href={item.url}>
                  <item.icon className="size-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <SidebarSeparator className="my-2 mx-2" />

          {/* Sección Secundaria al final */}
          {data.navSecondary.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                <Link href={item.url}>
                  <item.icon className="size-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}