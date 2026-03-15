import { getUserProfile } from "@/app/lib/auth/profile";
import FISPClient from "./FISPClient";
import AppLayout from "@/app/components/AppLayout";
import { redirect } from "next/navigation";

export default async function FISPPage() {
    const profile = await getUserProfile();

    if (!profile) {
        redirect("/login");
    }

    return (
        <AppLayout>
            <FISPClient profile={profile} />
        </AppLayout>
    );
}
