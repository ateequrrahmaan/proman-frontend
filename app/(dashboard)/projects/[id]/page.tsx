"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Settings, 
  Users,
  Loader2,
  MoreVertical,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api/client";
import { useAuthStore } from "@/store/authStore";

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const isAdmin = currentUser?.role === 'admin';
  const projectId = params.id;
  const [activeTab, setActiveTab] = useState("tasks");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await api.get(`/projects/${projectId}`);
      return response.data.data;
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async () => {
      await api.patch(`/projects/${projectId}/archive`);
    },
    onSuccess: () => {
      toast.success("Project archived");
      router.push("/projects");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to archive project");
    }
  });

  const updateProjectMutation = useMutation({
    mutationFn: async (values: any) => {
      await api.patch(`/projects/${projectId}`, values);
    },
    onSuccess: () => {
      toast.success("Project updated");
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update project");
    }
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["project-tasks", projectId],
    queryFn: async () => {
      const response = await api.get("/tasks", {
        params: { project: projectId }
      });
      return response.data.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string, status: string }) => {
      await api.patch(`/tasks/${taskId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
      toast.success("Task status updated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  });

  if (projectLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
           <Skeleton className="h-32 col-span-2" />
           <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold">Project not found</h2>
        <Button variant="link" asChild className="mt-4">
          <Link href="/projects">Back to Projects</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link 
        href="/projects" 
        className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
      </Link>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground">{project.description || "No description provided."}</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex -space-x-2">
             {project.members?.slice(0, 5).map((m: any) => (
                <Avatar key={m.user?._id} className="h-8 w-8 border-2 border-background">
                   <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                      {m.user?.name?.charAt(0).toUpperCase()}
                   </AvatarFallback>
                </Avatar>
             ))}
             {project.members?.length > 5 && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium">
                   +{project.members.length - 5}
                </div>
             )}
           </div>
           <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className="capitalize">
              {project.status}
           </Badge>
           {isAdmin && (
             <Button variant="outline" size="icon" onClick={() => setActiveTab("settings")}>
                <Settings className="h-4 w-4" />
             </Button>
           )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="settings" disabled={!isAdmin}>Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Project Tasks</h3>
              {isAdmin && (
                <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
                   <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" /> Add Task
                      </Button>
                   </DialogTrigger>
                   <DialogContent>
                      <DialogHeader>
                         <DialogTitle>Add New Task</DialogTitle>
                         <DialogDescription>Create a new task for this project.</DialogDescription>
                      </DialogHeader>
                      <AddTaskForm 
                        projectId={projectId} 
                        members={project.members}
                        onSuccess={() => {
                          queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
                          setIsTaskModalOpen(false);
                        }} 
                      />
                   </DialogContent>
                </Dialog>
              )}
           </div>

           <div className="grid gap-4">
              {tasksLoading ? (
                Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
              ) : tasks?.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-8 border-dashed">
                   <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                   <p className="text-muted-foreground">No tasks in this project yet.</p>
                </Card>
              ) : (
                tasks?.map((task: any) => (
                  <Card key={task._id} className="hover:bg-accent/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-3 w-3 rounded-full",
                            task.status === 'done' ? "bg-emerald-500" : task.status === 'in-progress' ? "bg-amber-500" : "bg-slate-300"
                          )} />
                          <div>
                            <p className={cn("font-medium text-sm", task.status === 'done' && "line-through text-muted-foreground")}>
                               {task.title}
                            </p>
                            {task.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1 max-w-[300px]">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                               <Clock className="h-3 w-3" />
                               {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "No due date"}
                            </div>
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                          <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 px-2 border border-input hover:bg-muted font-normal text-[10px] capitalize"
                                >
                                   {task.status.replace('-', ' ')}
                                   <MoreVertical className="ml-1 h-3 w-3" />
                                </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ taskId: task._id, status: 'todo' })}>
                                   Todo
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ taskId: task._id, status: 'in-progress' })}>
                                   In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ taskId: task._id, status: 'done' })}>
                                   Done
                                </DropdownMenuItem>
                             </DropdownMenuContent>
                          </DropdownMenu>

                          <Avatar className="h-6 w-6">
                             <AvatarFallback className="text-[10px]">
                                {task.assignedTo?.name?.charAt(0) || "U"}
                             </AvatarFallback>
                          </Avatar>
                       </div>
                    </CardContent>
                  </Card>
                ))
              )}
           </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Project Members</h3>
              {isAdmin && (
                <Dialog open={isMemberModalOpen} onOpenChange={setIsMemberModalOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                       <Plus className="mr-2 h-4 w-4" /> Add Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                     <DialogHeader>
                        <DialogTitle>Add Project Member</DialogTitle>
                        <DialogDescription>Assign a team member to this project.</DialogDescription>
                     </DialogHeader>
                     <AddMemberForm 
                       projectId={projectId} 
                       onSuccess={() => {
                         queryClient.invalidateQueries({ queryKey: ["project", projectId] });
                         setIsMemberModalOpen(false);
                       }} 
                     />
                  </DialogContent>
                </Dialog>
              )}
           </div>

           <Card>
              <CardContent className="p-0">
                 {!project.members || project.members.length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Users className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No members in this project yet.</p>
                   </div>
                 ) : (
                   <div className="divide-y">
                      {project.members.map((member: any) => (
                        <div key={member.user?._id} className="flex items-center justify-between p-4">
                           <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                 <AvatarFallback className="bg-primary/10 text-primary">
                                    {member.user?.name?.charAt(0).toUpperCase()}
                                 </AvatarFallback>
                              </Avatar>
                              <div>
                                 <p className="text-sm font-medium">{member.user?.name}</p>
                                 <p className="text-xs text-muted-foreground">{member.user?.email}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="capitalize text-[10px]">
                                 {member.role || 'Member'}
                              </Badge>
                              {isAdmin && member.user?._id !== currentUser?.id && (
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                       <Button variant="ghost" size="icon" className="h-8 w-8">
                                          <MoreVertical className="h-4 w-4" />
                                       </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                       <DropdownMenuItem className="text-destructive">
                                          <Trash2 className="mr-2 h-4 w-4" /> Remove
                                       </DropdownMenuItem>
                                    </DropdownMenuContent>
                                 </DropdownMenu>
                              )}
                           </div>
                        </div>
                      ))}
                   </div>
                 )}
              </CardContent>
           </Card>
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
            <Card>
               <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>Update your project name and description.</CardDescription>
               </CardHeader>
               <CardContent>
                  <form 
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      updateProjectMutation.mutate({
                        name: formData.get("name"),
                        description: formData.get("description"),
                      });
                    }}
                  >
                     <div className="space-y-2">
                        <Label htmlFor="name">Project Name</Label>
                        <Input id="name" name="name" defaultValue={project.name} required />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" name="description" defaultValue={project.description} />
                     </div>
                     <Button type="submit" disabled={updateProjectMutation.isPending}>
                        {updateProjectMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                     </Button>
                  </form>
               </CardContent>
            </Card>

            <Card className="border-destructive/50">
               <CardHeader>
                  <CardTitle className="text-destructive font-semibold">Danger Zone</CardTitle>
                  <CardDescription>Archive this project and all its tasks. This action is reversible by administrators.</CardDescription>
               </CardHeader>
               <CardContent>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      if (confirm("Are you sure you want to archive this project?")) {
                        archiveMutation.mutate();
                      }
                    }}
                    disabled={archiveMutation.isPending}
                  >
                     {archiveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                     Archive Project
                  </Button>
               </CardContent>
            </Card>
         </TabsContent>
      </Tabs>
    </div>
  );
}

const addTaskSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  assignedTo: z.string().min(1, "Assignee is required"),
  dueDate: z.string().optional(),
});

function AddTaskForm({ projectId, members, onSuccess }: { projectId: string; members: any[]; onSuccess: () => void }) {
  const form = useForm<z.infer<typeof addTaskSchema>>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      assignedTo: "",
      dueDate: "",
    }
  });


  const mutation = useMutation({
    mutationFn: async (values: any) => {
      await api.post("/tasks", { 
        title: values.title,
        description: values.description,
        assignedTo: values.assignedTo,
        dueDate: values.dueDate,
        projectId: projectId 
      });
    },
    onSuccess: () => {
      toast.success("Task added");
      form.reset();
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add task");
    }
  });

  return (
    <Form {...form}>
       <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl><Input placeholder="Task title" {...field} /></FormControl>
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
                <FormControl><Input placeholder="Task description (optional)" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign To</FormLabel>
                  <select 
                    className="w-full p-2 border rounded-md bg-background text-sm"
                    {...field}
                  >
                     <option value="">Select a member</option>
                     {members?.map((m: any) => (
                       <option key={m.user?._id} value={m.user?._id}>{m.user?.name}</option>
                     ))}
                  </select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
             {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
             Add Task
          </Button>
       </form>
    </Form>
  );
}

function AddMemberForm({ projectId, onSuccess }: { projectId: string; onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const mutation = useMutation({
    mutationFn: async () => {
       await api.patch(`/projects/${projectId}/members`, { members: [email] });
    },
    onSuccess: () => {
       toast.success("Member added to project");
       setEmail("");
       onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add member");
    }
  });

  return (
    <div className="space-y-4 pt-4">
       <div className="space-y-2">
          <Label>Member Email</Label>
          <Input 
            placeholder="colleague@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
       </div>
       <Button 
         className="w-full" 
         onClick={() => mutation.mutate()} 
         disabled={mutation.isPending || !email}
       >
          {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add to Project
       </Button>
    </div>
  );
}

