import { getUserProfile } from "@/app/lib/auth/profile";
import SettingsClient from "./SettingsClient";
import AppLayout from "@/app/components/AppLayout";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const profile = await getUserProfile();

    if (!profile) {
        redirect("/login");
    }

    return (
        <AppLayout>
            <SettingsClient profile={profile} />
        </AppLayout>
    );
}
