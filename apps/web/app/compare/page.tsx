import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCareerPlans } from "@/app/actions/career";
import { getOnboardingStatus } from "@/app/actions/onboarding";
import { CompareClient } from "./compare-client";

export default async function ComparePage({
    searchParams,
}: {
    searchParams: Promise<{ planA?: string; planB?: string }>;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/signin");
    }

    const { onboarded } = await getOnboardingStatus();
    if (!onboarded) {
        redirect("/onboarding");
    }

    const careerPlans = await getCareerPlans();
    const params = await searchParams;

    return (
        <CompareClient
            plans={careerPlans}
            initialPlanA={params.planA}
            initialPlanB={params.planB}
        />
    );
}
