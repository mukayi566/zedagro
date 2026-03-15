import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email, password, firstName, lastName, phone } = await request.json();

        // Use SERVICE_ROLE_KEY if available, otherwise fallback to ANON_KEY
        // Note: Creating users without logging out requires Service Role Key
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

        // 1. Create the auth user
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                first_name: firstName,
                last_name: lastName,
                role: "field_agent"
            }
        });

        if (authError) {
            // Fallback for demo: If admin API fails (missing key), try regular signUp
            // but warned: this might interfere with current session if not handled
            console.warn("Admin createUser failed, likely missing service_role key. Falling back to signUp.");

            const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        role: "field_agent"
                    }
                }
            });

            if (signUpError) throw signUpError;

            // Update profile for the new user
            if (signUpData.user) {
                const { error: profileError } = await supabaseAdmin
                    .from("profiles")
                    .update({
                        phone,
                        status: "active"
                    })
                    .eq("id", signUpData.user.id);

                if (profileError) console.error("Profile update error:", profileError);
            }
        } else {
            // 2. Update the profile (the trigger usually handles creation, but we ensure fields are set)
            if (authData.user) {
                const { error: profileError } = await supabaseAdmin
                    .from("profiles")
                    .update({
                        phone,
                        status: "active"
                    })
                    .eq("id", authData.user.id);

                if (profileError) console.error("Profile update error:", profileError);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Agent creation error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
