"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  CheckCircle2, 
  Clock, 
  Plus,
  ArrowRight,
  Target,
  Layout,
  Star,
  Zap,
  FolderKanban,
  Sparkles,
  TrendingUp
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

const taskStatusConfig: Record<string, { color: string; label: string }> = {
  done: { color: "bg-emerald-500", label: "Done" },
  "in-progress": { color: "bg-amber-500", label: "In Progress" },
  todo: { color: "bg-slate-400", label: "To Do" },
};

export function EmployeeDashboard() {
  const { user } = useAuthStore();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", "my-tasks"],
    queryFn: async () => {
      const response = await api.get("/tasks?limit=10");
      return response.data;
    },
  });

  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects", "my-projects"],
    queryFn: async () => {
      const response = await api.get("/projects?limit=3");
      return response.data;
    },
  });

  const myTasks = tasksData?.data || [];
  const pendingTasks = myTasks.filter((t: any) => t.status !== 'done');
  const completedToday = myTasks.filter((t: any) => t.status === 'done').length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium tracking-wide w-fit">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{greeting}, {user?.name?.split(" ")[0] || "there"}!</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Your Workspace</h1>
          <p className="text-muted-foreground">Here&apos;s what&apos;s on your plate for today.</p>
        </div>
        <Button className="rounded-xl brand-gradient text-white shadow-lg glow-primary hover:opacity-90 transition-all font-semibold" asChild>
          <Link href="/tasks">
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Link>
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="overflow-hidden border shadow-sm hover:-translate-y-0.5 transition-all duration-200 glow-card group relative">
          <div className="absolute top-[-20%] right-[-10%] opacity-5 group-hover:opacity-10 transition-opacity">
            <Clock className="h-32 w-32 text-indigo-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Pending Tasks</CardTitle>
            <div className="h-9 w-9 gap-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
              <Clock className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-4xl font-extrabold tracking-tight">
              {tasksLoading ? <Skeleton className="h-10 w-16" /> : pendingTasks.length}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground font-medium">
              <span className="text-indigo-600 dark:text-indigo-400">Keep it up</span>
              <span>· Stay focused</span>
            </div>
            <div className="mt-3 h-1 w-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-60" />
          </CardContent>
        </Card>

        <Card className="overflow-hidden border shadow-sm hover:-translate-y-0.5 transition-all duration-200 glow-card group relative">
          <div className="absolute top-[-20%] right-[-10%] opacity-5 group-hover:opacity-10 transition-opacity">
            <Target className="h-32 w-32 text-amber-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Focus Score</CardTitle>
            <div className="h-9 w-9 gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center">
              <Target className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-4xl font-extrabold tracking-tight">
              {tasksLoading ? <Skeleton className="h-10 w-16" /> : "88%"}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground font-medium">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">+5% vs last week</span>
            </div>
            <div className="mt-3 h-1 w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 opacity-60" />
          </CardContent>
        </Card>

        <Card className="overflow-hidden border shadow-sm hover:-translate-y-0.5 transition-all duration-200 glow-card group relative">
          <div className="absolute top-[-20%] right-[-10%] opacity-5 group-hover:opacity-10 transition-opacity">
            <Star className="h-32 w-32 text-emerald-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Completed Today</CardTitle>
            <div className="h-9 w-9 gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center">
              <Zap className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
             <div className="text-4xl font-extrabold tracking-tight">
               {completedToday}
             </div>
             <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground font-medium">
               <span className="text-emerald-600 dark:text-emerald-400">Great job!</span>
               <span>· {completedToday > 0 ? "You're on fire" : "Let's get started"}</span>
             </div>
             <div className="mt-3 h-1 w-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-60" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
         {/* Active Tasks Panel */}
         <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between px-1">
               <h3 className="text-lg font-bold flex items-center gap-2">
                  <Layout className="h-5 w-5 text-indigo-500" /> Active Tasks
               </h3>
               <Button variant="ghost" size="sm" asChild className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg">
                  <Link href="/tasks" className="flex items-center gap-1">View All <ArrowRight className="h-3 w-3" /></Link>
               </Button>
            </div>
            
            <div className="space-y-3">
               {tasksLoading ? (
                 Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)
               ) : pendingTasks.length === 0 ? (
                 <div className="text-center py-10 border-2 border-dashed rounded-2xl bg-card/50">
                    <CheckCircle2 className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm font-medium">Your task list is empty. Time to relax!</p>
                 </div>
               ) : (
                 pendingTasks.map((task: any) => {
                   const cfg = taskStatusConfig[task.status] || taskStatusConfig.todo;
                   return (
                     <div 
                        key={task._id} 
                        className="group p-4 bg-card border border-border/50 rounded-2xl flex items-center justify-between hover:bg-accent hover:border-indigo-200 dark:hover:border-indigo-800 transition-all shadow-sm"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                             "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner",
                             task.status === "in-progress" ? "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400" :
                             "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
                          )}>
                             <Clock className="h-5 w-5" />
                          </div>
                          <div className="space-y-1 min-w-0">
                             <h4 className="font-semibold text-sm text-foreground/90 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{task.title}</h4>
                             <p className="text-xs text-muted-foreground font-medium truncate">In {task.projectId?.name || 'General'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 pl-2">
                          <div className={cn(
                             "text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase shrink-0",
                             task.status === "in-progress" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400" :
                             task.status === "done" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400" :
                             "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          )}>
                             {cfg.label}
                          </div>
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-background shadow-sm hover:shadow">
                             <ArrowRight className="h-4 w-4 text-indigo-500" />
                          </Button>
                        </div>
                     </div>
                   );
                 })
               )}
            </div>
         </div>

         {/* Recent Projects Panel */}
         <div className="lg:col-span-2 space-y-4">
            <div className="px-1">
               <h3 className="text-lg font-bold flex items-center gap-2">
                  <FolderKanban className="h-5 w-5 text-indigo-500" /> Recent Projects
               </h3>
            </div>
            
            <div className="grid gap-4">
               {projectsLoading ? (
                  Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)
               ) : projectsData?.data?.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed rounded-2xl bg-card/50">
                     <p className="text-sm text-muted-foreground font-medium">No projects assigned.</p>
                  </div>
               ) : (
                  projectsData?.data?.map((project: any) => (
                    <Card key={project._id} className="group overflow-hidden border shadow-sm hover:shadow-md transition-all hover:border-indigo-200 dark:hover:border-indigo-800 bg-card rounded-2xl">
                       <CardHeader className="pb-3 pt-4 px-5">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">{project.name}</CardTitle>
                            <span className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ml-2",
                              project.status === "active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" : "bg-muted text-muted-foreground"
                            )}>
                              {project.status.slice(0, 3)}
                            </span>
                          </div>
                          <CardDescription className="text-xs line-clamp-1 mt-1">{project.description || "No description"}</CardDescription>
                       </CardHeader>
                       <CardContent className="pb-4 px-5 pt-0">
                          <div className="flex items-center justify-between">
                             <div className="flex -space-x-2">
                                <div className="h-7 w-7 rounded-full bg-indigo-100 dark:bg-indigo-900 border-2 border-background flex items-center justify-center text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                                   {project.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="h-7 w-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[9px] font-bold text-muted-foreground">
                                   +2
                                </div>
                             </div>
                             <Button variant="link" size="sm" asChild className="p-0 h-auto font-semibold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                                <Link href={`/projects/${project._id}`}>Enter <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
                             </Button>
                          </div>
                       </CardContent>
                    </Card>
                  ))
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
