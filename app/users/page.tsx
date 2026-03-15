import { redirect } from "next/navigation";
import { getUserProfile } from "../lib/auth/profile";
import UserManagement from "./UserManagement";
import AppLayout from "../components/AppLayout";

export default async function UsersPage() {
    const profile = await getUserProfile();

    if (!profile || profile.role !== "admin") {
        redirect("/dashboard");
    }

    return (
        <AppLayout>
            <UserManagement profile={profile} />
        </AppLayout>
    );
}

