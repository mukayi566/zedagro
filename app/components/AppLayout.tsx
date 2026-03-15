import { getUserProfile } from "@/app/lib/auth/profile";
import AppLayoutClient from "./AppLayoutClient";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    // Fetch profile once here to provide to the Sidebar
    const userProfile = await getUserProfile();

    return (
        <AppLayoutClient userProfile={userProfile}>
            {children}
        </AppLayoutClient>
    );
}
