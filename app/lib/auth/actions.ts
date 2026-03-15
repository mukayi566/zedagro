"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export async function login(formData: FormData) {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    });

    if (error) return { error: error.message };

    revalidatePath("/", "layout");
    redirect("/dashboard");
}

// ─── REGISTER FARMER (self-registration) ─────────────────────────────────────
export async function registerFarmer(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;
    const province = formData.get("province") as string;
    const district = formData.get("district") as string;
    const nationalId = formData.get("nationalId") as string;

    // Step 1: Create the auth user
    // The handle_new_user() trigger will automatically create the profiles row
    // with id, email, first_name, last_name, and role — do NOT insert again
    const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName,
                role: "farmer",
            },
        },
    });

    if (signUpError) return { error: signUpError.message };

    // Step 2: Update the profile row the trigger already created
    // with the fields the trigger doesn't have access to
    if (data.user) {
        const { error: profileError } = await supabase
            .from("profiles")
            .update({
                phone,
                province,
                district,
                national_id: nationalId,
                status: "pending",
            })
            .eq("id", data.user.id);

        if (profileError) return { error: profileError.message };
    }

    return { success: true };
}

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/login");
}