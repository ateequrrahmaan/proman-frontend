"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Settings, 
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Team", href: "/team", icon: Users },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className={cn(
      "relative flex flex-col border-r transition-all duration-300 ease-in-out sidebar-bg",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="flex h-16 items-center px-4 border-b border-[hsl(var(--sidebar-border))]">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2.5 font-bold transition-all duration-200">
            <div className="h-8 w-8 rounded-xl brand-gradient flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
              <Zap className="h-4 w-4" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              ProMan
            </span>
          </Link>
        )}

        {collapsed && (
          <Link href="/" className="flex items-center justify-center w-full">
            <div className="h-8 w-8 rounded-xl brand-gradient flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
              <Zap className="h-4 w-4" />
            </div>
          </Link>
        )}

        {/* Collapse toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute -right-3.5 top-[4.5rem] h-7 w-7 rounded-full border bg-card shadow-md p-0 hover:bg-indigo-50 hover:border-indigo-300 dark:hover:bg-indigo-950/50 transition-colors z-10"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed
            ? <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            : <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" />
          }
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 p-2 pt-3">
        {navigation
          .filter(item => {
            if (item.name === "Team") return useAuthStore.getState().user?.role === "admin";
            return true;
          })
          .map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "brand-gradient text-white shadow-md glow-primary"
                    : "text-muted-foreground hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300",
                  collapsed && "justify-center px-0"
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-white")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
      </nav>

      {/* Logout */}
      <div className="border-t border-[hsl(var(--sidebar-border))] p-2 pb-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 px-3 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all",
            collapsed && "justify-center px-0"
          )}
          onClick={() => logout()}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}
