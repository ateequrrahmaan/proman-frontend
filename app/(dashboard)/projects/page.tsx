"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  FolderKanban, 
  Plus, 
  Search,
  MoreVertical,
  Archive,
  ExternalLink,
  Loader2,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
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

const createProjectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().optional(),
  members: z.array(z.string()).optional(),
});

type CreateProjectValues = z.infer<typeof createProjectSchema>;

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("active");
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  const form = useForm<CreateProjectValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["projects", search, view],
    queryFn: async () => {
      const response = await api.get("/projects", {
        params: { 
          search,
          archived: view === "archived"
        },
      });
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: CreateProjectValues) => {
      const response = await api.post("/projects", values);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully");
      setIsOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create project");
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/projects/${id}/archive`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project archived");
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/projects/${id}/restore`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project restored");
    },
  });

  function onSubmit(values: CreateProjectValues) {
    const projectData = {
      ...values,
      members: user?.id ? [user.id] : [],
    };
    createMutation.mutate(projectData);
  }

  const projects = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage and track your organization&apos;s projects.</p>
        </div>
        
        {isAdmin && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Enter the details of the new project you want to create.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g. Website Redesign" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Optional project description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button 
                       type="submit" 
                       disabled={createMutation.isPending}
                    >
                      {createMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Create Project
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <Tabs value={view} onValueChange={setView} className="w-full max-w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader className="gap-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-full" />
              </CardHeader>
              <CardContent className="flex-1">
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
              <CardHeader className="flex flex-row space-y-0 pt-0">
                <Skeleton className="h-4 w-1/4 mr-auto" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </CardHeader>
            </Card>
          ))
        ) : projects.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl">
             <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
                <FolderKanban className="h-6 w-6" />
             </div>
             <h3 className="text-xl font-semibold">
               {view === "active" ? "No projects found" : "No archived projects found"}
             </h3>
             <p className="text-muted-foreground mb-6">
               {view === "active" ? "Create a project to get started." : "Archived projects will appear here."}
             </p>
             {isAdmin && (
                <Button onClick={() => setIsOpen(true)}>
                   <Plus className="mr-2 h-4 w-4" /> New Project
                </Button>
             )}
          </div>
        ) : (
          projects.map((project: any) => (
             <Card key={project._id} className="flex flex-col group hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                   <div className="space-y-1">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                         {project.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                          project.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                        )}>
                          {project.status}
                        </span>
                      </div>
                   </div>
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                         </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                         <DropdownMenuItem asChild>
                            <Link href={`/projects/${project._id}`} className="flex items-center gap-2">
                               <ExternalLink className="h-4 w-4" /> View Details
                            </Link>
                         </DropdownMenuItem>
                         {isAdmin && (
                            project.status === 'active' ? (
                               <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => archiveMutation.mutate(project._id)}
                               >
                                  <Archive className="h-4 w-4 mr-2" /> Archive
                               </DropdownMenuItem>
                            ) : (
                               <DropdownMenuItem 
                                  className="text-emerald-600"
                                  onClick={() => restoreMutation.mutate(project._id)}
                               >
                                  <Plus className="h-4 w-4 mr-2" /> Restore
                               </DropdownMenuItem>
                            )
                         )}
                      </DropdownMenuContent>
                   </DropdownMenu>
                </CardHeader>
                <CardContent className="flex-1">
                   <p className="text-sm text-muted-foreground line-clamp-3">
                      {project.description || "No description provided."}
                   </p>
                </CardContent>
                <div className="px-6 pb-6 pt-0 mt-auto flex items-center justify-between text-xs text-muted-foreground">
                   <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {project.members?.length || 0} members
                   </div>
                   <Link href={`/projects/${project._id}`} className="text-primary hover:underline flex items-center gap-1">
                      Open Project <ExternalLink className="h-3 w-3" />
                   </Link>
                </div>
             </Card>
          ))
        )}
      </div>
    </div>
  );
}
