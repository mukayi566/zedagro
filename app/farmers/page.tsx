import { getUserProfile } from "@/app/lib/auth/profile";
import FarmersClient from "./FarmersClient";
import AppLayout from "@/app/components/AppLayout";
import { redirect } from "next/navigation";

export default async function FarmersPage() {
    const profile = await getUserProfile();

    if (!profile) {
        redirect("/login");
    }

    return (
        <AppLayout>
            <FarmersClient profile={profile} />
        </AppLayout>
    );
}
