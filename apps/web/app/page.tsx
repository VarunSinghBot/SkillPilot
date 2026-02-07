import Link from "next/link";
import { auth } from "@/lib/auth";
import { ArrowRight, Sparkles, GitBranch, BarChart3, Zap } from "lucide-react";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                AI-Powered Career Planning
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6">
              Navigate Your Career Like{" "}
              <span className="text-gradient">Git for Your Future</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
              Create parallel career paths, track skills across timelines, and let AI guide you
              through decisions. Branch, experiment, and merge your way to success.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {session ? (
                <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <Link href="/auth/signin" className="btn-primary inline-flex items-center gap-2">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
              <Link href="/templates" className="btn-secondary">
                Browse Templates
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Why SkillPilot?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Traditional career planning is linear. Reality isn't. We give you the tools to explore
              multiple futures simultaneously.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<GitBranch className="w-6 h-6" />}
              title="Parallel Paths"
              description="Create multiple career branches. Compare 'Frontend Dev' vs 'Data Scientist' without losing progress in either."
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Persistent Skills"
              description="Skills you learn are yours forever. Delete a career path, keep all the skills and progress you've built."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="AI Guidance"
              description="Get intelligent suggestions for missing skills, realistic timelines, and conflict detection when paths overlap."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 sm:p-12 text-center animated-border">
            <div className="p-8 sm:p-12">
              <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4">
                Ready to pilot your career?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Join thousands of students and professionals mapping their futures with confidence.
              </p>
              {!session && (
                <Link href="/auth/signin" className="btn-primary inline-flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="glass-card-hover p-6 group">
      <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-primary-500/20">
        <span className="text-white">{icon}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  );
}
