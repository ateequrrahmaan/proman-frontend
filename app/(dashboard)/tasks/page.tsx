"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Filter, 
  Loader2, 
  Plus, 
  Search,
  Trash2,
  MoreHorizontal
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import api from "@/lib/api/client";
import { useAuthStore } from "@/store/authStore";

const statusColors = {
  todo: "bg-slate-100 text-slate-700 border-slate-200",
  "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
  done: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const isAdmin = currentUser?.role === 'admin';

  // Refresh tasks data when component mounts or window gains focus
  // This ensures tasks are updated after project membership changes
  React.useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  }, []);

  React.useEffect(() => {
    const handleVisibilityChange = () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [queryClient]);

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", search, statusFilters, sortBy, sortOrder],
    queryFn: async () => {
      const params: any = { search, sortBy, sortOrder };
      if (statusFilters.length > 0) {
        params.status = statusFilters; // Send as array - backend will handle it
      }
      
      const response = await api.get("/tasks", { params });
      return response.data.data;
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

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleStatusFilterToggle = (status: string) => {
    setStatusFilters(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setStatusFilters([]);
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate(id);
    }
  };

  const columns = [
    { id: "todo", title: "To Do", icon: Circle },
    { id: "in-progress", title: "In Progress", icon: Clock },
    { id: "done", title: "Done", icon: CheckCircle2 },
  ];

  const filteredColumns = statusFilters.length > 0 
    ? columns.filter(column => statusFilters.includes(column.id))
    : columns;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage and track your tasks across all projects.</p>
        </div>
        {isAdmin && (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Task
          </Button>
        )}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className={statusFilters.length > 0 ? "bg-primary/10" : ""}>
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("todo")}
              onCheckedChange={() => handleStatusFilterToggle("todo")}
            >
              <div className="flex items-center gap-2">
                <Circle className="h-4 w-4 text-slate-400" />
                To Do
              </div>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("in-progress")}
              onCheckedChange={() => handleStatusFilterToggle("in-progress")}
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                In Progress
              </div>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("done")}
              onCheckedChange={() => handleStatusFilterToggle("done")}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Done
              </div>
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSortBy("createdAt")}>
              Created Date
              {sortBy === "createdAt" && <span className="ml-auto text-xs">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("dueDate")}>
              Due Date
              {sortBy === "dueDate" && <span className="ml-auto text-xs">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("title")}>
              Title
              {sortBy === "title" && <span className="ml-auto text-xs">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
              Order: {sortOrder === "asc" ? "Ascending" : "Descending"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={clearFilters}>
              Clear All Filters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-6 md:grid-cols-3 h-full items-start">
        {filteredColumns.map((column) => (
          <div key={column.id} className="flex flex-col gap-4 bg-muted/30 p-4 rounded-xl min-h-[500px]">
            <div className="flex items-center gap-2">
               <column.icon className={cn(
                 "h-5 w-5",
                 column.id === 'todo' ? "text-slate-400" : column.id === 'in-progress' ? "text-blue-500" : "text-emerald-500"
               )} />
               <h3 className="font-semibold">{column.title}</h3>
               <Badge variant="secondary" className="ml-auto">
                 {Array.isArray(tasks) ? tasks.filter((t: any) => t.status === column.id).length : 0}
               </Badge>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
              ) : Array.isArray(tasks) ? (
                tasks.filter((t: any) => t.status === column.id).map((task: any) => (
                  <Card key={task._id} className="cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors">
                    <CardHeader className="p-4 pb-2">
                       <div className="flex items-start justify-between gap-2">
                         <CardTitle className="text-sm font-medium leading-tight flex-1">
                           {task.title}
                         </CardTitle>
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-6 w-6">
                               <MoreHorizontal className="h-3 w-3" />
                             </Button>
                           </DropdownMenuTrigger>
                           {isAdmin && (
                             <DropdownMenuContent align="end">
                               <DropdownMenuItem 
                                 onClick={() => handleDeleteTask(task._id)}
                                 className="text-destructive focus:text-destructive"
                               >
                                 <Trash2 className="h-4 w-4 mr-2" />
                                 Delete Task
                               </DropdownMenuItem>
                             </DropdownMenuContent>
                           )}
                         </DropdownMenu>
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
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
