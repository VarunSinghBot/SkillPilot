import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTemplates } from "@/app/actions/templates";
import { getOnboardingStatus } from "@/app/actions/onboarding";
import { TemplatesClient } from "./templates-client";

export default async function TemplatesPage() {
    const session = await auth();
    if (session?.user) {
        const { onboarded } = await getOnboardingStatus();
        if (!onboarded) {
            redirect("/onboarding");
        }
    }
    const templates = await getTemplates();

    return <TemplatesClient isAuthenticated={!!session?.user} templates={templates} />;
}
