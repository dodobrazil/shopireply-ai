import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !isAdminEmail(user.email || "")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const adminClient = await createAdminClient();
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = 50;
    const offset = (page - 1) * pageSize;

    const { data: users, error, count } = await adminClient
      .from("profiles")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;

    // Get total generation stats
    const { data: stats } = await adminClient
      .from("generations")
      .select("id", { count: "exact", head: true });

    return NextResponse.json({
      users,
      totalUsers: count,
      totalGenerations: stats,
      page,
      pageSize,
    });
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !isAdminEmail(user.email || "")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId, plan, limit } = await request.json();

    if (!userId || !plan) {
      return NextResponse.json(
        { error: "userId and plan are required" },
        { status: 400 }
      );
    }

    const planLimits: Record<string, number> = {
      free: 10,
      starter: 500,
      pro: 2000,
    };

    const adminClient = await createAdminClient();
    const { error } = await (adminClient as any)
      .from("profiles")
      .update({
        plan: plan as "free" | "starter" | "pro",
        monthly_generation_limit: limit || planLimits[plan] || 10,
      })
      .eq("id", userId);

    if (error) throw error;

    await (adminClient as any).from("usage_events").insert({
      user_id: userId,
      event_type: "plan_changed",
      metadata: { plan, changed_by: user.email, admin: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin update user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
