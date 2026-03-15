import { getUserProfile } from "@/app/lib/auth/profile";
import DroneSurveysClient from "./DroneSurveysClient";
import AppLayout from "@/app/components/AppLayout";
import { redirect } from "next/navigation";

export default async function DroneSurveysPage() {
    const profile = await getUserProfile();

    if (!profile) {
        redirect("/login");
    }

    return (
        <AppLayout>
            <DroneSurveysClient profile={profile} />
        </AppLayout>
    );
}
