"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Users, 
  Mail, 
  ShieldCheck, 
  Shield, 
  UserPlus, 
  Trash2,
  Loader2,
  Copy,
  ExternalLink,
  Check
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import api from "@/lib/api/client";
import { useAuthStore } from "@/store/authStore";

const inviteSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "employee"]),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

export default function TeamPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { user: currentUser } = useAuthStore();
  const isAdmin = currentUser?.role === 'admin';
  const queryClient = useQueryClient();

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      role: "employee",
    },
  });

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get("/users");
      return response.data.data;
    },
    enabled: isAdmin,
  });

  const { data: invites, isLoading: invitesLoading } = useQuery({
    queryKey: ["invites"],
    queryFn: async () => {
      const response = await api.get("/invites");
      return response.data.data;
    },
    enabled: isAdmin,
  });

  const inviteMutation = useMutation({
    mutationFn: async (values: InviteFormValues) => {
      const response = await api.post("/invites", values);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Invitation created successfully!");
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      setIsOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send invitation");
    },
  });

  function onInvite(values: InviteFormValues) {
    inviteMutation.mutate(values);
  }

  if (!isAdmin) {
    return (
      <Card className="p-12 text-center flex flex-col items-center justify-center">
        <Shield className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold">Access Denied</h2>
        <p className="text-muted-foreground">Only administrators can access the organization team management.</p>
        <Button onClick={() => router.push("/dashboard")} className="mt-6">Back to Dashboard</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">Manage your organization&apos;s members and invites.</p>
        </div>
        
        {isAdmin && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation email to a new team member.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onInvite)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="colleague@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <div className="flex gap-4 pt-2">
                           <Button 
                             type="button" 
                             variant={field.value === 'employee' ? 'default' : 'outline'}
                             className="flex-1"
                             onClick={() => field.onChange('employee')}
                           >
                             Employee
                           </Button>
                           <Button 
                             type="button" 
                             variant={field.value === 'admin' ? 'default' : 'outline'}
                             className="flex-1"
                             onClick={() => field.onChange('admin')}
                           >
                             Admin
                           </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="pt-4">
                    <Button type="submit" className="w-full" disabled={inviteMutation.isPending}>
                      {inviteMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Send Invitation
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization Members</CardTitle>
          <CardDescription>
            A list of all users currently in your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="divide-y">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 py-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                       <Skeleton className="h-4 w-32" />
                       <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                ))
              ) : (
                users?.map((u: any) => (
                  <div key={u._id} className="flex items-center justify-between py-4 group">
                     <div className="flex items-center gap-4">
                        <Avatar>
                           <AvatarFallback className="bg-primary/10 text-primary">
                             {u.name.charAt(0).toUpperCase()}
                           </AvatarFallback>
                        </Avatar>
                        <div>
                           <p className="font-medium">{u.name} {u._id === currentUser?.id && <span className="text-xs text-muted-foreground ml-2">(You)</span>}</p>
                           <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                 <Mail className="h-3 w-3" /> {u.email}
                              </span>
                              <Badge variant="outline" className="text-[10px] py-0 h-4 capitalize">
                                 {u.role === 'admin' ? <ShieldCheck className="h-2 w-2 mr-1" /> : <Shield className="h-2 w-2 mr-1" />}
                                 {u.role}
                              </Badge>
                           </div>
                        </div>
                     </div>
                     {isAdmin && u._id !== currentUser?.id && (
                       <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="h-4 w-4 text-destructive" />
                       </Button>
                     )}
                  </div>
                ))
              )}
           </div>
        </CardContent>
      </Card>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
            <CardDescription>
              Invites that have been sent but not yet accepted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {invitesLoading ? (
                Array(2).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full mb-2" />
                ))
              ) : !invites || invites.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No pending invitations.
                </div>
              ) : (
                invites.map((invite: any) => (
                  <div key={invite._id} className="flex items-center justify-between py-4">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{invite.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] py-0 h-4 capitalize">
                          {invite.role}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          Expires: {new Date(invite.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-[11px]"
                        onClick={() => {
                          navigator.clipboard.writeText(invite.inviteLink);
                          toast.success("Invite link copied to clipboard");
                        }}
                      >
                        <Copy className="h-3 w-3 mr-2" /> Copy Link
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
