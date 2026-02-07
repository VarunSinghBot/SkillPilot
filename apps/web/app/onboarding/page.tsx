import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getOnboardingStatus } from "@/app/actions/onboarding";
import { OnboardingClient } from "./onboarding-client";

export default async function OnboardingPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/signin");
    }

    const { onboarded } = await getOnboardingStatus();
    if (onboarded) {
        redirect("/dashboard");
    }

    return <OnboardingClient userName={session.user.name || "there"} />;
}
