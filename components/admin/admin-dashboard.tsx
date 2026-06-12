"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import type { Profile } from "@/types/database";
import { Users, Zap, Crown, TrendingUp, Shield, Loader2 } from "lucide-react";

interface AdminStats {
  users: Profile[];
  totalUsers: number;
  totalGenerations: number;
  page: number;
}

const PLAN_OPTIONS = [
  { value: "free", label: "Free" },
  { value: "starter", label: "Starter" },
  { value: "pro", label: "Pro" },
];

export function AdminDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setStats(data);
    } catch {
      toast({ title: "Failed to load admin data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlan = async (userId: string, plan: string) => {
    setUpdatingUserId(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, plan }),
      });

      if (res.ok) {
        toast({ title: `Plan updated to ${plan}` });
        fetchStats(); // Refresh
      } else {
        toast({ title: "Failed to update plan", variant: "destructive" });
      }
    } catch {
      toast({ title: "Network error", variant: "destructive" });
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const planCounts = stats?.users.reduce(
    (acc, u) => {
      acc[u.plan] = (acc[u.plan] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  ) || {};

  const totalRevenue =
    (planCounts["starter"] || 0) * 9.99 + (planCounts["pro"] || 0) * 19.99;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage users, plans, and view usage statistics
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">Total Users</span>
            </div>
            <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium text-muted-foreground">Total Generations</span>
            </div>
            <p className="text-3xl font-bold">{stats?.totalGenerations || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <Crown className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-medium text-muted-foreground">Paid Users</span>
            </div>
            <p className="text-3xl font-bold">
              {(planCounts["starter"] || 0) + (planCounts["pro"] || 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-muted-foreground">Est. MRR</span>
            </div>
            <p className="text-3xl font-bold">${totalRevenue.toFixed(0)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Plan breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {["free", "starter", "pro"].map((p) => (
          <Card key={p}>
            <CardContent className="p-4 text-center">
              <p className="text-sm font-medium capitalize text-muted-foreground mb-1">{p}</p>
              <p className="text-2xl font-bold">{planCounts[p] || 0}</p>
              <p className="text-xs text-muted-foreground">users</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Users ({stats?.totalUsers || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground text-xs">
                  <th className="text-left py-2 px-2">Email</th>
                  <th className="text-left py-2 px-2">Name</th>
                  <th className="text-left py-2 px-2">Plan</th>
                  <th className="text-left py-2 px-2">Usage</th>
                  <th className="text-left py-2 px-2">Joined</th>
                  <th className="text-left py-2 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats?.users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <span className="font-mono text-xs">{user.email}</span>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {user.full_name || "—"}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                          user.plan === "pro"
                            ? "bg-amber-100 text-amber-700"
                            : user.plan === "starter"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {user.plan}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground text-xs">
                      {user.monthly_generation_count}/{user.monthly_generation_limit}
                    </td>
                    <td className="py-3 px-2 text-muted-foreground text-xs">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="py-3 px-2">
                      <select
                        value={user.plan}
                        onChange={(e) => handleUpdatePlan(user.id, e.target.value)}
                        disabled={updatingUserId === user.id}
                        className="text-xs border border-input rounded-lg px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        {PLAN_OPTIONS.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
