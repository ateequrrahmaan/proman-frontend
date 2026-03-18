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
  Activity,
  Sparkles
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
import { useAuthStore } from "@/store/authStore";

const statConfigs = [
  {
    name: "Total Projects",
    icon: FolderKanban,
    gradient: "from-blue-500 to-indigo-500",
    light: "bg-blue-50 dark:bg-blue-950/50",
    text: "text-blue-600 dark:text-blue-400",
  },
  {
    name: "Total Tasks",
    icon: Clock,
    gradient: "from-amber-500 to-orange-500",
    light: "bg-amber-50 dark:bg-amber-950/50",
    text: "text-amber-600 dark:text-amber-400",
  },
  {
    name: "Completed",
    icon: CheckCircle2,
    gradient: "from-emerald-500 to-teal-500",
    light: "bg-emerald-50 dark:bg-emerald-950/50",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  {
    name: "Active Members",
    icon: Users,
    gradient: "from-violet-500 to-purple-500",
    light: "bg-violet-50 dark:bg-violet-950/50",
    text: "text-violet-600 dark:text-violet-400",
  },
];

const taskStatusConfig: Record<string, { color: string; label: string }> = {
  done: { color: "bg-emerald-500", label: "Done" },
  "in-progress": { color: "bg-amber-500", label: "In Progress" },
  todo: { color: "bg-slate-400", label: "To Do" },
};

export function AdminDashboard() {
  const { user } = useAuthStore();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

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

  const isLoading = projectsLoading || tasksLoading || usersLoading;

  const stats = [
    { ...statConfigs[0], value: projectsData?.pagination?.totalItems || 0 },
    { ...statConfigs[1], value: tasksData?.pagination?.totalItems || 0 },
    { ...statConfigs[2], value: tasksData?.data?.filter((t: any) => t.status === "done").length || 0 },
    { ...statConfigs[3], value: usersData?.pagination?.total || 0 },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{greeting}, {user?.name?.split(" ")[0] || "Admin"}!</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
          <p className="text-muted-foreground">Manage your organization and track global progress.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild className="rounded-xl">
            <Link href="/team">
              <Users className="mr-2 h-4 w-4" /> Team
            </Link>
          </Button>
          <Button asChild className="rounded-xl brand-gradient text-white glow-primary hover:opacity-90">
            <Link href="/projects">
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="overflow-hidden border shadow-sm hover:-translate-y-0.5 transition-all duration-200 glow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-5 px-5">
              <CardTitle className="text-sm font-semibold text-muted-foreground">{stat.name}</CardTitle>
              <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center", stat.light)}>
                <stat.icon className={cn("h-4.5 w-4.5", stat.text)} />
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="text-3xl font-extrabold tracking-tight">
                {isLoading ? <Skeleton className="h-9 w-16" /> : stat.value}
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Active</span>
                <span>· Updated now</span>
              </div>
              {/* Accent bar */}
              <div className={cn("mt-3 h-1 w-full rounded-full bg-gradient-to-r opacity-60", stat.gradient)} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main panels */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Projects panel */}
        <Card className="col-span-4 border shadow-sm">
          <CardHeader className="border-b bg-muted/30 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Organization Projects</CardTitle>
                <CardDescription className="mt-0.5">All active projects in your org</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 rounded-lg">
                <Link href="/projects" className="flex items-center gap-1">
                  View All <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4 px-4">
            <div className="space-y-1">
              {projectsLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                ))
              ) : projectsData?.data?.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed rounded-2xl">
                  <FolderKanban className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm font-medium">No projects yet.</p>
                  <Button variant="link" asChild className="mt-1 text-indigo-600">
                    <Link href="/projects">Create your first project</Link>
                  </Button>
                </div>
              ) : (
                projectsData?.data?.map((project: any) => (
                  <Link
                    key={project._id}
                    href={`/projects/${project._id}`}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent transition-colors group"
                  >
                    <div className="h-10 w-10 rounded-xl brand-gradient text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                      {project.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-foreground/90 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{project.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{project.description || "No description"}</p>
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0",
                      project.status === "active"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {project.status}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity panel */}
        <Card className="col-span-3 border shadow-sm">
          <CardHeader className="border-b bg-muted/30 px-6 py-4">
            <CardTitle className="text-base font-semibold">Task Activity</CardTitle>
            <CardDescription className="mt-0.5">Latest tasks across the org</CardDescription>
          </CardHeader>
          <CardContent className="pt-5 px-5">
            <div className="space-y-4">
              {tasksLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))
              ) : tasksData?.data?.length === 0 ? (
                <div className="text-center py-10">
                  <Activity className="h-9 w-9 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No recent activity.</p>
                </div>
              ) : (
                tasksData?.data?.map((task: any) => {
                  const cfg = taskStatusConfig[task.status] || taskStatusConfig.todo;
                  return (
                    <div key={task._id} className="flex items-start gap-3 group">
                      <div className={cn("h-2 w-2 rounded-full mt-1.5 shrink-0", cfg.color)} />
                      <div className="flex-1 min-w-0">
                        <span className={cn(
                          "text-sm font-medium block truncate",
                          task.status === "done" && "text-muted-foreground line-through"
                        )}>
                          {task.title}
                        </span>
                        <span className={cn(
                          "text-[10px] font-semibold tracking-wider uppercase",
                          task.status === "done" ? "text-emerald-500" :
                          task.status === "in-progress" ? "text-amber-500" : "text-muted-foreground"
                        )}>
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
