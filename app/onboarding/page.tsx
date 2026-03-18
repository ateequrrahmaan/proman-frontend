"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Building2, Loader2, ArrowRight, Users, Zap, CheckCircle2 } from "lucide-react";

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
import { cn } from "@/lib/utils";
import api from "@/lib/api/client";
import { useAuthStore } from "@/store/authStore";

const createOrgSchema = z.object({
  name: z.string().min(2, { message: "Organization name must be at least 2 characters" }),
});

type CreateOrgValues = z.infer<typeof createOrgSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [view, setView] = useState<"choice" | "create">("choice");

  const form = useForm<CreateOrgValues>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: { name: "" },
  });

  const createOrgMutation = useMutation({
    mutationFn: async (data: CreateOrgValues) => {
      const response = await api.post("/organizations", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Organization created! Welcome aboard 🎉");
      if (data.data?.user) {
        updateUser({
          organizationId: data.data.user.organizationId,
          role: data.data.user.role,
        });
      }
      router.push("/dashboard");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });

  function onSubmit(data: CreateOrgValues) {
    createOrgMutation.mutate(data);
  }

  if (user?.organizationId) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-background p-4">
      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl animate-blob" />
        <div className="absolute top-1/2 -right-32 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Step progress */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-indigo-500" />
          <div className={cn("h-8 w-px bg-border")} />
          <div className={cn(
            "h-2 w-2 rounded-full transition-all duration-300",
            view === "create" ? "bg-indigo-500" : "bg-muted-foreground/30"
          )} />
        </div>
        <span className="ml-2 text-xs text-muted-foreground">
          {view === "choice" ? "Step 1 of 2 — Choose path" : "Step 2 of 2 — Create org"}
        </span>
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-2xl brand-gradient flex items-center justify-center shadow-lg glow-primary">
              <Zap className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, {user?.name?.split(" ")[0] || "there"}!
          </h1>
          <p className="text-muted-foreground">
            {view === "choice"
              ? "Let's get your workspace set up."
              : "Give your organization a name."}
          </p>
        </div>

        {view === "choice" && (
          <div className="grid gap-4">
            {/* Create org card */}
            <button
              onClick={() => setView("create")}
              className="group w-full text-left p-5 rounded-2xl border bg-card hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold text-foreground">Create Organization</h3>
                  <p className="text-sm text-muted-foreground">
                    Start fresh as an admin. Invite your team afterward.
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-indigo-600 group-hover:translate-x-1 transition-all mt-1 shrink-0" />
              </div>
            </button>

            {/* Join org card */}
            <div className="w-full text-left p-5 rounded-2xl border bg-card/50">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-300 flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-foreground">Join Organization</h3>
                  <p className="text-sm text-muted-foreground">
                    If you have an invite link, click it from your email to join automatically.
                  </p>
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      Ask your admin to invite <span className="font-semibold">{user?.email}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === "create" && (
          <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Organization Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Acme Corp"
                          className="h-11 rounded-xl bg-muted/50 border-border/60 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-11 rounded-xl"
                    onClick={() => setView("choice")}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-11 rounded-xl brand-gradient text-white glow-primary hover:opacity-90 transition-all"
                    disabled={createOrgMutation.isPending}
                  >
                    {createOrgMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}
