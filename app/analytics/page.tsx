import { getUserProfile } from "@/app/lib/auth/profile";
import AnalyticsClient from "./AnalyticsClient";
import AppLayout from "@/app/components/AppLayout";
import { redirect } from "next/navigation";

export default async function AnalyticsPage() {
    const profile = await getUserProfile();

    if (!profile) {
        redirect("/login");
    }

    return (
        <AppLayout>
            <AnalyticsClient profile={profile} />
        </AppLayout>
    );
}
