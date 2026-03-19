"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle2, 
  LayoutDashboard, 
  Users, 
  Zap,
  BarChart3,
  Shield,
  Sun,
  Moon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/authStore";

export default function LandingPage() {
  const { token } = useAuthStore();
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            PM
          </div>
          <span className="text-xl font-bold tracking-tight">ProMan</span>
        </Link>
        <div className="flex items-center gap-4">
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
          {token ? (
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tighter"
            >
              Manage Projects with <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                Unmatched Efficiency
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              The all-in-one project management platform for modern teams. 
              Track tasks, collaborate with members, and hit your deadlines with ease.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center gap-4"
            >
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                 <Link href="/register">
                   Start for Free <ArrowRight className="ml-2 h-5 w-5" />
                 </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                 <Link href="/login">Live Demo</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-24 bg-muted/30">
          <div className="max-w-6xl mx-auto">
             <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">Everything you need to ship faster</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">Built for precision and speed. Our tools help you stay focused on the work that matters.</p>
             </div>
             
             <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Advanced Kanban",
                    description: "Visualize your workflow with a powerful, drag-and-drop Kanban board.",
                    icon: LayoutDashboard,
                  },
                  {
                    title: "Team Collaboration",
                    description: "Invite your colleagues and assign tasks with distinct roles and permissions.",
                    icon: Users,
                  },
                  {
                    title: "Real-time Metrics",
                    description: "Track your progress with beautiful dashboards and data visualizations.",
                    icon: BarChart3,
                  },
                  {
                    title: "Security First",
                    description: "Enterprise-grade security with JWT authentication and RBAC.",
                    icon: Shield,
                  },
                  {
                    title: "Lightning Speed",
                    description: "Optimized for performance with Next.js 14 and TanStack Query.",
                    icon: Zap,
                  },
                  {
                    title: "Smart Invites",
                    description: "Onboard your entire team in seconds with secure invite tokens.",
                    icon: CheckCircle2,
                  },
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-2xl border bg-card hover:shadow-xl transition-all"
                  >
                     <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                        <feature.icon className="h-6 w-6" />
                     </div>
                     <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                     <p className="text-muted-foreground">{feature.description}</p>
                  </motion.div>
                ))}
             </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-24 text-center">
            <div className="max-w-3xl mx-auto p-12 rounded-3xl bg-primary text-primary-foreground space-y-6">
                <h2 className="text-3xl md:text-5xl font-bold italic tracking-tight underline-offset-8 decoration-white/30 underline decoration-double">
                  Ready to transform your workflow?
                </h2>
                <p className="text-primary-foreground/80 text-lg">
                  Join thousands of teams who trust ProMan to deliver excellence every single day.
                </p>
                <Button size="lg" variant="secondary" className="h-12 px-8 text-base font-semibold" asChild>
                   <Link href="/register">Get Started Now</Link>
                </Button>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              PM
            </div>
            <span className="font-bold">ProMan</span>
          </Link>
          <div className="flex gap-8 text-sm text-muted-foreground group">
             <Link href="#" className="hover:text-primary">Twitter</Link>
             <Link href="#" className="hover:text-primary">LinkedIn</Link>
             <Link href="#" className="hover:text-primary">Github</Link>
             <Link href="#" className="hover:text-primary">Privacy</Link>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 ProMan Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
