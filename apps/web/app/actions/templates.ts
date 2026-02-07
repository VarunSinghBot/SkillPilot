"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "@skillpilot/db";

const DEFAULT_TEMPLATES = [
    {
        name: "Frontend Developer",
        description: "Build modern, responsive web applications with React, TypeScript, and CSS",
        category: "Web Development",
        skills: [
            { name: "HTML & CSS", weeks: 4 },
            { name: "JavaScript", weeks: 8 },
            { name: "React", weeks: 6 },
            { name: "TypeScript", weeks: 4 },
            { name: "CSS Frameworks", weeks: 2 },
            { name: "Testing", weeks: 4 },
        ],
    },
    {
        name: "Backend Developer",
        description: "Design and build scalable server-side applications and APIs",
        category: "Web Development",
        skills: [
            { name: "Node.js", weeks: 6 },
            { name: "Databases", weeks: 6 },
            { name: "REST APIs", weeks: 4 },
            { name: "Authentication", weeks: 3 },
            { name: "Docker", weeks: 3 },
            { name: "Cloud Basics", weeks: 4 },
        ],
    },
    {
        name: "Full Stack Developer",
        description: "Master both frontend and backend development for complete web solutions",
        category: "Web Development",
        skills: [
            { name: "HTML & CSS", weeks: 4 },
            { name: "JavaScript", weeks: 8 },
            { name: "React", weeks: 6 },
            { name: "Node.js", weeks: 6 },
            { name: "Databases", weeks: 6 },
            { name: "Git", weeks: 2 },
            { name: "DevOps", weeks: 4 },
        ],
    },
    {
        name: "Data Scientist",
        description: "Analyze data, build ML models, and derive insights for business decisions",
        category: "Data & AI",
        skills: [
            { name: "Python", weeks: 8 },
            { name: "Statistics", weeks: 6 },
            { name: "Machine Learning", weeks: 10 },
            { name: "SQL", weeks: 4 },
            { name: "Data Visualization", weeks: 4 },
            { name: "Deep Learning", weeks: 8 },
        ],
    },
    {
        name: "UI/UX Designer",
        description: "Create beautiful and intuitive user interfaces and experiences",
        category: "Design",
        skills: [
            { name: "Design Principles", weeks: 4 },
            { name: "Figma", weeks: 3 },
            { name: "User Research", weeks: 4 },
            { name: "Prototyping", weeks: 3 },
            { name: "Design Systems", weeks: 4 },
            { name: "Accessibility", weeks: 3 },
        ],
    },
    {
        name: "Mobile Developer",
        description: "Build native and cross-platform mobile applications",
        category: "Mobile",
        skills: [
            { name: "React Native", weeks: 6 },
            { name: "JavaScript", weeks: 6 },
            { name: "Mobile UI", weeks: 4 },
            { name: "APIs", weeks: 4 },
            { name: "App Store Publishing", weeks: 2 },
            { name: "Performance", weeks: 4 },
        ],
    },
    {
        name: "DevOps Engineer",
        description: "Automate and streamline software deployment and infrastructure",
        category: "Infrastructure",
        skills: [
            { name: "Linux", weeks: 4 },
            { name: "Docker", weeks: 4 },
            { name: "Kubernetes", weeks: 6 },
            { name: "CI/CD", weeks: 4 },
            { name: "Cloud Platforms", weeks: 6 },
            { name: "Monitoring", weeks: 4 },
        ],
    },
    {
        name: "Security Engineer",
        description: "Protect systems and data from cyber threats",
        category: "Security",
        skills: [
            { name: "Network Security", weeks: 4 },
            { name: "Cryptography", weeks: 4 },
            { name: "Penetration Testing", weeks: 6 },
            { name: "Security Tools", weeks: 4 },
            { name: "Compliance", weeks: 3 },
        ],
    },
];

async function ensureTemplates() {
    const count = await prisma.template.count();
    if (count > 0) return;

    for (const template of DEFAULT_TEMPLATES) {
        const savedTemplate = await prisma.template.upsert({
            where: { name: template.name },
            create: {
                name: template.name,
                description: template.description,
                category: template.category,
            },
            update: {
                description: template.description,
                category: template.category,
            },
        });

        const skillIds: string[] = [];
        for (const skill of template.skills) {
            const savedSkill = await prisma.skill.upsert({
                where: { name: skill.name },
                create: {
                    name: skill.name,
                    description: null,
                    category: template.category,
                },
                update: {},
            });
            skillIds.push(savedSkill.id);

            await prisma.templateSkill.createMany({
                data: [
                    {
                        templateId: savedTemplate.id,
                        skillId: savedSkill.id,
                        suggestedWeeks: skill.weeks,
                    },
                ],
                skipDuplicates: true,
            });
        }
    }
}

export async function getTemplates() {
    await ensureTemplates();

    const templates = (await prisma.template.findMany({
        include: {
            skills: {
                include: {
                    skill: true,
                },
            },
        },
        orderBy: { name: "asc" },
    })) as {
        id: string;
        name: string;
        description: string | null;
        category: string | null;
        skills: { suggestedWeeks: number; skill: { name: string } }[];
    }[];

    return templates.map((template) => {
        const totalWeeks = template.skills.reduce((sum, ts) => sum + ts.suggestedWeeks, 0);
        return {
            id: template.id,
            name: template.name,
            description: template.description,
            category: template.category,
            estimatedWeeks: totalWeeks,
            skills: template.skills.map((ts) => ts.skill.name),
        };
    });
}

export async function createCareerPlanFromTemplate(templateId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const template = (await prisma.template.findUnique({
        where: { id: templateId },
        include: {
            skills: {
                include: { skill: true },
            },
        },
    })) as {
        id: string;
        name: string;
        description: string | null;
        skills: { skillId: string; suggestedWeeks: number; skill: { name: string } }[];
    } | null;

    if (!template) throw new Error("Template not found");

    const totalWeeks = template.skills.reduce((sum, ts) => sum + ts.suggestedWeeks, 0);
    const deadline = totalWeeks > 0
        ? new Date(Date.now() + totalWeeks * 7 * 24 * 60 * 60 * 1000)
        : null;

    const plan = await prisma.careerPlan.create({
        data: {
            userId: session.user.id,
            title: template.name,
            goal: template.description,
            deadline,
        },
    });

    const skillIds = template.skills.map((ts) => ts.skillId);

    await prisma.careerSkill.createMany({
        data: skillIds.map((skillId) => ({
            careerPlanId: plan.id,
            skillId,
        })),
        skipDuplicates: true,
    });

    await Promise.all(
        skillIds.map((skillId) =>
            prisma.skillProgress.upsert({
                where: {
                    userId_skillId: {
                        userId: session.user.id,
                        skillId,
                    },
                },
                create: {
                    userId: session.user.id,
                    skillId,
                    progressPercentage: 0,
                },
                update: {},
            })
        )
    );

    revalidatePath("/dashboard");

    return { planId: plan.id };
}
