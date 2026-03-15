import { getUserProfile } from "@/app/lib/auth/profile";
import DashboardClient from "./DashboardClient";
import PendingVerification from "@/app/components/auth/PendingVerification";
import { redirect } from "next/navigation";
import AppLayout from "@/app/components/AppLayout";

export default async function DashboardPage() {
    const profile = await getUserProfile();

    if (!profile) {
        redirect("/login");
    }

    // If user is a farmer and their status is pending, show the verification screen
    if (profile.role === "farmer" && profile.status === "pending") {
        return <PendingVerification name={profile.first_name || "Valued Farmer"} />;
    }

    return (
        <AppLayout>
            <DashboardClient profile={profile} />
        </AppLayout>
    );
}
