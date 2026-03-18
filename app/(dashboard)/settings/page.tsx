"use client";

import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/client";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon, 
  Building2, 
  Bell, 
  LogOut, 
  ShieldAlert,
  Moon,
  Sun
} from "lucide-react";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { Separator } from "../../../components/ui/separator";

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();

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
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and organization settings.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="organization" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" /> Organization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how ProMan looks for you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold">Theme Mode</Label>
                  <p className="text-sm text-muted-foreground">Switch between light and dark mode.</p>
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="rounded-xl border-primary/20"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-400" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure how you receive alerts and updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" /> Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">Receive daily summaries and project alerts.</p>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">Enabled</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 bg-destructive/5 shadow-sm">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" /> Danger Zone
              </CardTitle>
              <CardDescription>Irreversible actions for your personal account.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Deleting your account will remove all your data and access. This cannot be undone.
              </p>
              <Button variant="destructive" className="font-semibold px-8">Delete Account</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization" className="space-y-6 mt-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>View and manage your organization's configuration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input 
                    id="org-name" 
                    value={isLoading ? "Loading..." : profile?.organizationId?.name || "No Organization"} 
                    readOnly 
                    className="bg-muted font-medium focus-visible:ring-0" 
                  />
                  <p className="text-xs text-muted-foreground italic">Your organization's registered name.</p>
                </div>
              </div>
              
              {user.role === "admin" && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-3">
                  <h4 className="font-semibold text-primary">Admin Access</h4>
                  <p className="text-sm text-muted-foreground">
                    As an administrator, you can manage team members, billing, and project-wide settings.
                  </p>
                  <Button variant="link" className="p-0 text-primary font-bold h-auto hover:no-underline">Go to Team Management →</Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t bg-muted/20 px-6 py-4">
              <p className="text-sm text-muted-foreground">
                Want to leave this organization? <Button variant="link" className="p-0 text-destructive h-auto">Leave Organization</Button>
              </p>
            </CardFooter>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Organization-wide security settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Enforce 2FA for all organization members.</p>
                </div>
                <Badge variant="outline" className="border-primary/20 text-primary">Admin Only</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="pt-8 border-t">
        <Button 
          variant="outline" 
          className="w-full sm:w-auto gap-2 border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all px-8 rounded-xl"
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4" /> Finalize Session (Logout)
        </Button>
      </div>
    </div>
  );
}
