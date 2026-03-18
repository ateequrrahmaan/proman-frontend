"use client";

import { useAuthStore } from "@/store/authStore";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { EmployeeDashboard } from "@/components/dashboard/EmployeeDashboard";

export default function DashboardPage() {
  const { user } = useAuthStore();

  if (user?.role === "admin") {
    return <AdminDashboard />;
  }

  return <EmployeeDashboard />;
}
