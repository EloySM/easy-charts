import { supabaseServer } from "@/lib/supabase/server"
import { AppSidebar } from "./app-sidebar"

export async function AppSidebarWithUser() {

  const supabase = await supabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const userName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "No Username"
  const userEmail = user?.email || ""

  return (
    <AppSidebar
      user={{
        name: userName,
        email: userEmail,
        avatar: "https://github.com/shadcn.png",
      }}
    />
  )
}
