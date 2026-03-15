import { getUserProfile } from "@/app/lib/auth/profile";
import ProfileClient from "@/app/profile/ProfileClient";
import { redirect } from "next/navigation";
import AppLayout from "@/app/components/AppLayout";

export default async function ProfilePage() {
    const profile = await getUserProfile();

    if (!profile) {
        redirect("/login");
    }

    return (
        <AppLayout>
            <ProfileClient profile={profile} />
        </AppLayout>
    );
}
