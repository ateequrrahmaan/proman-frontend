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
  FolderKanban
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

export function EmployeeDashboard() {
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Welcome back!
          </h1>
          <p className="text-muted-foreground font-medium">Here&apos;s what&apos;s on your plate for today.</p>
        </div>
        <Button className="rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-semibold" asChild>
          <Link href="/tasks">
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute top-[-20%] right-[-10%] opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="h-40 w-40 text-primary" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary/80 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black italic tracking-tighter">
              {tasksLoading ? <Skeleton className="h-12 w-16" /> : pendingTasks.length}
            </div>
            <p className="text-xs text-muted-foreground font-semibold mt-2">4 due by the end of this week</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute top-[-20%] right-[-10%] opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 className="h-40 w-40 text-emerald-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-2">
              <Target className="h-4 w-4" /> Focus Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black italic tracking-tighter">
              {tasksLoading ? <Skeleton className="h-12 w-16" /> : "88%"}
            </div>
            <p className="text-xs text-muted-foreground font-semibold mt-2">Highest productivity in the afternoon</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/20 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute top-[-20%] right-[-10%] opacity-10 group-hover:opacity-20 transition-opacity">
            <Star className="h-40 w-40 text-amber-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-amber-600 flex items-center gap-2">
              <Zap className="h-4 w-4" /> Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black italic tracking-tighter text-amber-600">
               {completedToday}
            </div>
            <p className="text-xs text-muted-foreground font-semibold mt-2">Tasks finished today. Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
         <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-xl font-bold flex items-center gap-2">
                  <Layout className="h-5 w-5 text-primary" /> Active Tasks
               </h3>
               <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
                  <Link href="/tasks" className="flex items-center gap-1">All Tasks <ArrowRight className="h-3 w-3" /></Link>
               </Button>
            </div>
            
            <div className="space-y-3">
               {tasksLoading ? (
                 Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)
               ) : pendingTasks.length === 0 ? (
                 <Card className="border-dashed py-12 text-center bg-transparent">
                    <p className="text-muted-foreground font-medium italic">Your task list is empty. Time to relax!</p>
                 </Card>
               ) : (
                 pendingTasks.map((task: any) => (
                   <div 
                      key={task._id} 
                      className="group p-5 bg-card/60 backdrop-blur-md border border-border/50 rounded-2xl flex items-center justify-between hover:bg-card hover:shadow-lg transition-all border-l-4 border-l-primary"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                           <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                           <h4 className="font-bold text-foreground/90">{task.title}</h4>
                           <p className="text-xs text-muted-foreground font-medium">Assigned in: {task.projectId?.name || 'General'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-[10px] font-black tracking-widest px-2.5 py-1 bg-muted rounded-full uppercase">
                           {task.status}
                        </div>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                           <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                   </div>
                 ))
               )}
            </div>
         </div>

         <div className="lg:col-span-2 space-y-4">
            <div className="px-2">
               <h3 className="text-xl font-bold flex items-center gap-2">
                  <FolderKanban className="h-5 w-5 text-primary" /> Recent Projects
               </h3>
            </div>
            
            <div className="grid gap-4">
               {projectsLoading ? (
                  Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)
               ) : projectsData?.data?.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic px-2">No projects assigned.</p>
               ) : (
                  projectsData?.data?.map((project: any) => (
                    <Card key={project._id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow bg-card/30">
                       <CardHeader className="pb-2">
                          <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{project.name}</CardTitle>
                       </CardHeader>
                       <CardContent className="pb-4 pt-0">
                          <div className="flex items-center justify-between">
                             <div className="flex -space-x-2">
                                <Skeleton className="h-6 w-6 rounded-full ring-2 ring-background" />
                                <Skeleton className="h-6 w-6 rounded-full ring-2 ring-background" />
                                <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[8px] font-bold">+2</div>
                             </div>
                             <Button variant="link" size="sm" asChild className="p-0 h-auto font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link href={`/projects/${project._id}`}>Enter <ArrowRight className="ml-1 h-3 w-3" /></Link>
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

