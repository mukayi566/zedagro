import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { userId } = await request.json();

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        // 1. Delete from auth.users (requires service role)
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (authError) {
             // If admin API fails (likely missing key), we can't delete from auth
             // but we can at least mark as suspended in the profile
             console.warn("Admin deleteUser failed. Marking as suspended instead.");
             await supabaseAdmin.from("profiles").update({ status: "suspended" }).eq("id", userId);
             return NextResponse.json({ success: true, message: "User suspended (admin delete unavailable)" });
        }

        // 2. The profile is usually deleted via cascade or trigger, but we ensure it's gone
        await supabaseAdmin.from("profiles").delete().eq("id", userId);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("User deletion error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
