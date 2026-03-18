"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Bell, Search, Sun, Moon, Folder, CheckCircle, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

export function Header() {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ projects: any[], tasks: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 1) {
        setIsLoading(true);
        try {
          const response = await api.get(`/search?q=${query}`);
          setResults(response.data.data);
          setIsOpen(true);
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults(null);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (type: 'project' | 'task', id: string, projectId?: string) => {
    setIsOpen(false);
    setQuery("");
    if (type === 'project') {
      router.push(`/projects/${id}`);
    } else if (projectId) {
      router.push(`/projects/${projectId}`);
    }
  };

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-md px-6 sticky top-0 z-40 shadow-sm">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className={cn(
          "relative w-96 transition-all duration-200",
          isFocused && "w-[28rem]"
        )} ref={searchRef}>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search projects, tasks..."
            className="pl-10 pr-10 rounded-full bg-muted/60 border-transparent focus-visible:border-indigo-300 focus-visible:ring-2 focus-visible:ring-indigo-500/20 transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              if (query.length > 1) setIsOpen(true);
            }}
          />
          {isLoading && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}

          {isOpen && results && (
            <div className="absolute top-full left-0 w-full mt-2 bg-card border rounded-2xl shadow-2xl z-50 max-h-[400px] overflow-y-auto p-2 animate-in fade-in slide-in-from-top-2 duration-200">
              {results.projects.length === 0 && results.tasks.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No results found for &quot;{query}&quot;
                </div>
              ) : (
                <div className="space-y-3">
                  {results.projects.length > 0 && (
                    <div>
                      <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Projects</p>
                      {results.projects.map((p) => (
                        <button
                          key={p._id}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-accent transition-colors text-left"
                          onClick={() => handleSelect('project', p._id)}
                        >
                          <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center shrink-0">
                            <Folder className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{p.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{p.description || "No description"}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {results.tasks.length > 0 && (
                    <div>
                      <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tasks</p>
                      {results.tasks.map((t) => (
                        <button
                          key={t._id}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-accent transition-colors text-left"
                          onClick={() => handleSelect('task', t._id, t.project?._id)}
                        >
                          <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shrink-0">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{t.title}</p>
                            <p className="text-xs text-muted-foreground truncate">In {t.project?.name || "Project"}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4.5 w-4.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4.5 w-4.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-500">
            <span className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-75" />
          </span>
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 ring-2 ring-transparent hover:ring-indigo-400 transition-all">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="brand-gradient text-white text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-2xl shadow-2xl" align="end" forceMount>
            <DropdownMenuLabel className="font-normal px-3 py-2.5">
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm font-semibold leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground mt-1">{user?.email}</p>
                <span className="mt-1.5 inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 uppercase tracking-wider w-fit dark:bg-indigo-950 dark:text-indigo-300">
                  {user?.role || "member"}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer w-full rounded-lg">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer w-full rounded-lg">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()} className="text-red-500 rounded-lg focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/30">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
