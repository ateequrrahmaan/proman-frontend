"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Building2, Loader2, ArrowRight, Users } from "lucide-react";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
    defaultValues: {
      name: "",
    },
  });

  const createOrgMutation = useMutation({
    mutationFn: async (data: CreateOrgValues) => {
      const response = await api.post("/organizations", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Organization created successfully!");
      // data is { success: true, data: { organization, user }, message: "" }
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

  // If user already has an org, redirect to dashboard
  if (user?.organizationId) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name || "User"}!</h1>
          <p className="text-muted-foreground">Let&apos;s get you set up with an organization.</p>
        </div>

        {view === "choice" && (
          <div className="grid gap-4">
            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setView("create")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Building2 className="h-5 w-5 text-primary" />
                  Create Organization
                </CardTitle>
                <CardDescription>
                  Start a new organization and become the admin.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                 <Button variant="ghost" className="w-full justify-between">
                    Get Started <ArrowRight className="h-4 w-4" />
                 </Button>
              </CardFooter>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Join Organization
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  To join an existing organization, please click on the invite link sent to your email by your administrator.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg border italic text-sm text-muted-foreground">
                  Note: Tell your admin to send you an invite link to your registered email ({user?.email}).
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {view === "create" && (
          <Card>
            <CardHeader>
              <CardTitle>Create Organization</CardTitle>
              <CardDescription>
                Enter the name of your new organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corp" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2 w-full">
                     <Button type="button" variant="outline" className="flex-1" onClick={() => setView("choice")}>
                        Back
                     </Button>
                     <Button type="submit" className="flex-1" disabled={createOrgMutation.isPending}>
                        {createOrgMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Create
                     </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
