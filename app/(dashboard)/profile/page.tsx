"use client";

import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/client";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { User, Mail, Shield, Building2, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await api.get("/users/profile");
      return response.data.data;
    },
    enabled: !!user,
  });

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and preferences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 border-primary/10 shadow-lg bg-gradient-to-br from-background to-accent/20">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-24 w-24 border-4 border-primary/20 ring-4 ring-primary/10">
                <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Badge variant="secondary" className="capitalize px-4 py-1">
                {user.role}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Details about your account and identity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-transparent hover:border-primary/20 transition-all">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Full Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-transparent hover:border-primary/20 transition-all">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Email Address</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-transparent hover:border-primary/20 transition-all">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Account Role</p>
                  <p className="font-medium capitalize">{user.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-transparent hover:border-primary/20 transition-all">
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Organization</p>
                  <p className="font-medium">{isLoading ? "Loading..." : profile?.organizationId?.name || "No Organization"}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Account Security</h3>
              <p className="text-sm text-muted-foreground">
                Your account is protected with standard encryption. Update your password or security settings in the Settings page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
