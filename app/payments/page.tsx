import { getUserProfile } from "@/app/lib/auth/profile";
import PaymentsClient from "./PaymentsClient";
import AppLayout from "@/app/components/AppLayout";
import { redirect } from "next/navigation";

export default async function PaymentsPage() {
    const profile = await getUserProfile();

    if (!profile) {
        redirect("/login");
    }

    return (
        <AppLayout>
            <PaymentsClient profile={profile} />
        </AppLayout>
    );
}
