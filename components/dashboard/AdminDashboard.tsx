"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  Users,
  Plus,
  ArrowRight,
  TrendingUp,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api/client";

export function AdminDashboard() {
  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects", "summary"],
    queryFn: async () => {
      const response = await api.get("/projects?limit=5");
      return response.data;
    },
  });

  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", "summary"],
    queryFn: async () => {
      const response = await api.get("/tasks?limit=5");
      return response.data;
    },
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["users", "summary"],
    queryFn: async () => {
      const response = await api.get("/users?limit=1");
      return response.data;
    },
  });

  const stats = [
    {
      name: "Total Projects",
      value: projectsData?.pagination?.totalItems || 0,
      icon: FolderKanban,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      name: "Total Tasks",
      value: tasksData?.pagination?.totalItems || 0,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      name: "Completed Tasks",
      value: tasksData?.data?.filter((t: any) => t.status === 'done').length || 0,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      name: "Active Members",
      value: usersData?.pagination?.total || 0,
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
      description: "Organization team members"
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground/90">Admin Overview</h1>
          <p className="text-muted-foreground font-medium">Manage your organization and track global progress.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/team">
                <Users className="mr-2 h-4 w-4" /> Team
              </Link>
            </Button>
            <Button asChild>
              <Link href="/projects">
                <Plus className="mr-2 h-4 w-4" /> New Project
              </Link>
            </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="overflow-hidden border-none shadow-md bg-card/50 backdrop-blur-sm hover:translate-y-[-2px] transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{stat.name}</CardTitle>
              <div className={`${stat.bg} ${stat.color} p-2 rounded-xl`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {projectsLoading || tasksLoading || usersLoading ? <Skeleton className="h-9 w-16" /> : stat.value}
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground font-medium">
                <Activity className="h-3 w-3" />
                <span>{stat.name === "Active Members" ? "Total active users" : "Updated just now"}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 font-sans">
         <Card className="col-span-4 border-none shadow-lg bg-card/40">
            <CardHeader className="border-b bg-muted/20 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Organization Projects</CardTitle>
                  <CardDescription className="font-medium">
                    Overview of all active projects in your organization.
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/projects" className="flex items-center gap-1 text-primary">
                    View All <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {projectsLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-2 border-b last:border-0">
                      <Skeleton className="h-10 w-10 rounded-xl" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                  ))
                ) : projectsData?.data?.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-muted/10">
                    <FolderKanban className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">No projects found in this organization.</p>
                    <Button variant="link" asChild className="mt-2">
                      <Link href="/projects">Create your first project</Link>
                    </Button>
                  </div>
                ) : (
                  projectsData?.data?.map((project: any) => (
                    <Link 
                      key={project._id} 
                      href={`/projects/${project._id}`}
                      className="flex items-center gap-4 p-4 border rounded-2xl hover:bg-muted/50 transition-all group border-transparent hover:border-border shadow-sm hover:shadow-md"
                    >
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center font-bold text-lg">
                        {project.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground/90">{project.name}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                      </div>
                      <div className={cn(
                        "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest",
                        project.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                      )}>
                        {project.status}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
         </Card>

         <Card className="col-span-3 border-none shadow-lg bg-card/40">
            <CardHeader className="border-b bg-muted/20 pb-4">
              <CardTitle className="text-xl">Team Activity</CardTitle>
              <CardDescription className="font-medium">
                Latest updates from your team.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
               <div className="space-y-6">
                  {tasksLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                         <Skeleton className="h-8 w-8 rounded-full" />
                         <Skeleton className="h-4 flex-1" />
                      </div>
                    ))
                  ) : tasksData?.data?.length === 0 ? (
                    <div className="text-center py-12">
                      <Activity className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground font-medium">No recent activity found.</p>
                    </div>
                  ) : (
                    tasksData?.data?.map((task: any) => (
                      <div key={task._id} className="flex items-start gap-3 group">
                         <div className={cn(
                           "h-2 w-2 rounded-full mt-2 shrink-0 animate-pulse",
                           task.status === 'done' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : 
                           task.status === 'in-progress' ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : 
                           "bg-slate-300"
                         )} />
                         <div className="flex-1 min-w-0">
                            <span className={cn(
                                "text-sm font-medium transition-colors block truncate", 
                                task.status === 'done' && "text-muted-foreground line-through decoration-emerald-500/50"
                            )}>
                                {task.title}
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                                Assigned to: Team Member
                            </span>
                         </div>
                      </div>
                    ))
                  )}
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
