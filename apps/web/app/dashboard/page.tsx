import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCareerPlans } from "@/app/actions/career";
import { getOnboardingStatus } from "@/app/actions/onboarding";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/signin");
    }

    const { onboarded } = await getOnboardingStatus();
    if (!onboarded) {
        redirect("/onboarding");
    }

    const careerPlans = await getCareerPlans();

    return <DashboardClient initialPlans={careerPlans} user={session.user} />;
}
