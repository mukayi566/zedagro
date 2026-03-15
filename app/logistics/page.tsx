import { getUserProfile } from "@/app/lib/auth/profile";
import LogisticsClient from "./LogisticsClient";
import AppLayout from "@/app/components/AppLayout";
import { redirect } from "next/navigation";

export default async function LogisticsPage() {
    const profile = await getUserProfile();

    if (!profile) {
        redirect("/login");
    }

    return (
        <AppLayout>
            <LogisticsClient profile={profile} />
        </AppLayout>
    );
}
