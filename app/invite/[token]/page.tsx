"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Mail, Users } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import api from "@/lib/api/client";
import { useAuthStore } from "@/store/authStore";

export default function InvitePage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const { user, token: authToken, updateUser } = useAuthStore();
  const token = params.token;

  // 1. Verify the invite token details
  const { data: inviteData, isLoading, isError, error } = useQuery({
    queryKey: ["invite", token],
    queryFn: async () => {
      const response = await api.get(`/invites/verify/${token}`);
      return response.data.data;
    },
    retry: false,
  });

  // 2. Accept invite mutation
  const acceptMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/invites/accept", { token });
      return response.data;
    },
    onSuccess: async () => {
      toast.success("Successfully joined the organization!");
      try {
        const profileResponse = await api.get("/users/profile");
        if (profileResponse.data.success) {
          updateUser(profileResponse.data.data);
        }
      } catch (error) {
        console.error("Failed to refresh profile after joining", error);
      }
      router.push("/dashboard");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to accept invite";
      toast.error(message);
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted/40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="max-w-md text-center">
            <CardHeader>
                <CardTitle className="text-destructive">Invalid or Expired Invite</CardTitle>
                <CardDescription>
                    {(error as any).response?.data?.message || "We couldn't verify this invitation."}
                </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
                <Button asChild>
                    <Link href="/">Return Home</Link>
                </Button>
            </CardFooter>
        </Card>
      </div>
    );
  }

  const handleAccept = () => {
    // If not logged in, they must login/register first
    if (!authToken || !user) {
        // Save the intended invite URL to return here after login if possible, 
        // for now just redirecting user to login, asking them to come back
        toast.info("Please login to accept your invitation.");
        router.push("/login");
        return;
    }

    // Must match email
    if (user.email !== inviteData?.email) {
        toast.error("You are logged in with a different email than this invite.");
        return;
    }

    acceptMutation.mutate();
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">You&apos;ve been invited!</CardTitle>
          <CardDescription className="text-base text-foreground">
            You have been invited to join <strong>{inviteData?.organization}</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center gap-2 rounded-md bg-muted p-3 text-sm">
             <Mail className="h-4 w-4 text-muted-foreground" />
             <span className="text-muted-foreground">Invited email:</span>
             <strong className="ml-auto">{inviteData?.email}</strong>
           </div>
           
           {!authToken ? (
             <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive-foreground">
               Please log in or create an account with <strong>{inviteData?.email}</strong> to accept this invitation.
             </div>
           ) : user?.email !== inviteData?.email ? (
               <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive-foreground">
                 You are logged in as {user?.email}. Please log out and log in with {inviteData?.email} to accept.
             </div>
           ) : null}
        </CardContent>
        <CardFooter className="flex-col gap-2">
          {(!authToken || user?.email !== inviteData?.email) ? (
              <div className="flex w-full gap-2">
                 <Button className="w-full" variant="outline" asChild>
                    <Link href="/login">Login</Link>
                 </Button>
                 <Button className="w-full" asChild>
                    <Link href="/register">Sign Up</Link>
                 </Button>
              </div>
          ) : (
             <Button 
                className="w-full" 
                size="lg"
                onClick={handleAccept}
                disabled={acceptMutation.isPending}
             >
                {acceptMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Accept Invitation
             </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
