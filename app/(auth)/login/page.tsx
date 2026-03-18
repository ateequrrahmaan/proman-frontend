"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Zap, CheckCircle2, LayoutDashboard, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import api from "@/lib/api/client";
import { useAuthStore } from "@/store/authStore";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const features = [
  { icon: LayoutDashboard, text: "Kanban boards & sprint tracking" },
  { icon: Users, text: "Team collaboration with RBAC" },
  { icon: CheckCircle2, text: "Task assignment & deadline alerts" },
];

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const response = await api.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Welcome back! 🎉");
      const { token, ...user } = data.data;
      setAuth(token, user);
      if (!user.organizationId) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });

  function onSubmit(data: LoginFormValues) {
    loginMutation.mutate(data);
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col justify-between p-12 overflow-hidden brand-gradient">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full animate-blob" />
          <div className="absolute top-1/2 -right-24 w-72 h-72 bg-white/5 rounded-full animate-blob animation-delay-2000" />
          <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-violet-500/20 rounded-full animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">ProMan</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold text-white leading-tight">
              Manage projects<br />with precision.
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-sm">
              The all-in-one workspace for teams who move fast and ship great work.
            </p>
          </div>

          <div className="space-y-3">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
                  <f.icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-white/90 text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/50 text-sm">© 2026 ProMan Inc. All rights reserved.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl brand-gradient flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">ProMan</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground text-sm">Sign in to your account to continue</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@company.com"
                        className="h-11 rounded-xl bg-muted/50 border-border/60 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="h-11 rounded-xl bg-muted/50 border-border/60 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-400 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-11 rounded-xl brand-gradient text-white font-semibold glow-primary hover:opacity-90 transition-all"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline">
              Get started free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
