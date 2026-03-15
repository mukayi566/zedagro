import { getUserProfile } from "@/app/lib/auth/profile";
import FraudClient from "./FraudClient";
import AppLayout from "@/app/components/AppLayout";
import { redirect } from "next/navigation";

export default async function FraudPage() {
    const profile = await getUserProfile();

    if (!profile) {
        redirect("/login");
    }

    return (
        <AppLayout>
            <FraudClient profile={profile} />
        </AppLayout>
    );
}
