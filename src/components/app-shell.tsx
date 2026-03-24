"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Gamepad2,
  Tag,
  Settings,
  Sparkles,
  LogOut,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/releases", label: "Releases", icon: Tag },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - dark themed */}
      <aside className="hidden w-60 shrink-0 md:flex md:flex-col bg-sidebar text-sidebar-foreground">
        <div className="flex h-16 items-center gap-3 px-5 border-b border-sidebar-border">
          <div className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary shadow-lg shadow-sidebar-primary/25">
            <Sparkles className="size-5 text-sidebar-primary-foreground" />
          </div>
          <Link href="/dashboard" className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">Release Tracker</span>
            <span className="text-[10px] text-sidebar-foreground/50 font-medium">Game Studio</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/25"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="size-[18px]" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border space-y-2">
          <div className="rounded-xl bg-sidebar-accent/50 p-3">
            <p className="text-[10px] font-medium text-sidebar-foreground/40 uppercase tracking-wider">3 Games Tracked</p>
            <p className="text-xs text-sidebar-foreground/60 mt-1">Auto-synced via GitLab + PlayStore</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-sidebar-foreground/40 hover:text-sidebar-foreground/70 hover:bg-sidebar-accent/50 transition-colors"
          >
            <LogOut className="size-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b bg-card/80 backdrop-blur-sm px-4 md:hidden">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary shadow-md shadow-primary/25">
            <Sparkles className="size-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm">Release Tracker</span>
          <nav className="ml-auto flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg p-2 transition-all",
                  pathname.startsWith(item.href)
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="size-4" />
              </Link>
            ))}
          </nav>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
