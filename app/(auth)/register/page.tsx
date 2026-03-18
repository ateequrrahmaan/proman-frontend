"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Zap, BarChart3, Shield, Users } from "lucide-react";

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
import { cn } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const steps = ["Name", "Email", "Password"];

const highlights = [
  { icon: BarChart3, text: "Real-time dashboards & analytics" },
  { icon: Shield, text: "Enterprise-grade security & RBAC" },
  { icon: Users, text: "Invite your team in seconds" },
];

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const { watch } = form;
  const name = watch("name");
  const email = watch("email");
  const password = watch("password");

  const currentStep = password.length > 0 ? 2 : email.length > 0 ? 1 : name.length > 0 ? 0 : -1;

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      const response = await api.post("/auth/register", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Account created! Let's get you set up. 🚀");
      const { token, ...user } = data.data;
      setAuth(token, user);
      router.push("/onboarding");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });

  function onSubmit(data: RegisterFormValues) {
    registerMutation.mutate(data);
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Right brand panel (swapped intentionally) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative flex-col justify-between p-12 overflow-hidden order-2"
        style={{ background: "linear-gradient(135deg, hsl(280,85%,55%) 0%, hsl(243,75%,59%) 100%)" }}>
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/10 rounded-full animate-blob" />
          <div className="absolute top-20 -left-20 w-72 h-72 bg-white/5 rounded-full animate-blob animation-delay-2000" />
          <div className="absolute top-2/3 right-1/3 w-64 h-64 bg-indigo-500/20 rounded-full animate-blob animation-delay-4000" />
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
              Build faster.<br />Ship smarter.
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-sm">
              Join thousands of high-performing teams who trust ProMan to get things done.
            </p>
          </div>

          <div className="space-y-3">
            {highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
                  <h.icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-white/90 text-sm font-medium">{h.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/50 text-sm">© 2026 ProMan Inc. All rights reserved.</p>
        </div>
      </div>

      {/* Left form panel */}
      <div className="flex flex-1 flex-col items-center justify-center p-8 bg-background order-1">
        <div className="w-full max-w-sm space-y-7">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl brand-gradient flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">ProMan</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Create your account</h2>
            <p className="text-muted-foreground text-sm">Free forever. No credit card required.</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-1">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center gap-1">
                <div className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  i <= currentStep ? "bg-indigo-500 w-8" : "bg-muted w-5"
                )} />
                {i < steps.length - 1 && <div className="w-1" />}
              </div>
            ))}
            <span className="ml-2 text-xs text-muted-foreground font-medium">
              {currentStep >= 0 ? steps[Math.min(currentStep, 2)] : "Getting started"}
            </span>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Jane Smith"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Work Email</FormLabel>
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
                          placeholder="Min. 6 characters"
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
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
