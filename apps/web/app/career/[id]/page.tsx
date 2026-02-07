import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getCareerPlanWithProgress } from "@/app/actions/career";
import { getOnboardingStatus } from "@/app/actions/onboarding";
import { CareerDetailClient } from "./career-detail-client";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function CareerDetailPage({ params }: Props) {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/signin");
    }

    const { onboarded } = await getOnboardingStatus();
    if (!onboarded) {
        redirect("/onboarding");
    }

    const { id } = await params;

    try {
        const careerPlan = await getCareerPlanWithProgress(id);
        return <CareerDetailClient plan={careerPlan} />;
    } catch (error) {
        notFound();
    }
}
