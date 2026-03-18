"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Filter, 
  Loader2, 
  Plus, 
  Search 
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api/client";

const statusColors = {
  todo: "bg-slate-100 text-slate-700 border-slate-200",
  "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
  done: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", search],
    queryFn: async () => {
      const response = await api.get("/tasks", {
        params: { search }
      });
      return response.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await api.patch(`/tasks/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const columns = [
    { id: "todo", title: "To Do", icon: Circle },
    { id: "in-progress", title: "In Progress", icon: Clock },
    { id: "done", title: "Done", icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage and track your tasks across all projects.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Task
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 h-full items-start">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col gap-4 bg-muted/30 p-4 rounded-xl min-h-[500px]">
            <div className="flex items-center gap-2">
               <column.icon className={cn(
                 "h-5 w-5",
                 column.id === 'todo' ? "text-slate-400" : column.id === 'in-progress' ? "text-blue-500" : "text-emerald-500"
               )} />
               <h3 className="font-semibold">{column.title}</h3>
               <Badge variant="secondary" className="ml-auto">
                 {tasks?.filter((t: any) => t.status === column.id).length || 0}
               </Badge>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
              ) : (
                tasks?.filter((t: any) => t.status === column.id).map((task: any) => (
                  <Card key={task._id} className="cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors">
                    <CardHeader className="p-4 pb-2">
                       <div className="flex items-start justify-between gap-2">
                         <CardTitle className="text-sm font-medium leading-tight">
                           {task.title}
                         </CardTitle>
                       </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                       <p className="text-xs text-muted-foreground line-clamp-2">
                         {task.description || "No description"}
                       </p>
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {task.dueDate ? format(new Date(task.dueDate), "MMM d") : "No date"}
                         </div>
                         <Badge 
                           variant="outline" 
                           className="text-[9px] uppercase tracking-wider"
                         >
                           {task.project?.name.substring(0, 10)}...
                         </Badge>
                       </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
