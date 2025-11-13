/**
 * Training Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - Reduced JavaScript bundle size
 * - Better SEO and initial page load
 * - ISR revalidation every 1 hour
 */

import {
  Award,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  Lightbulb,
  Rocket,
  Shield,
  Star,
  TrendingUp,
  Upload,
  Users,
  Wrench,
} from "lucide-react";

export const revalidate = 3600; // Revalidate every 1 hour

export default function TrainingDashboardPage() {
  return (
    <div className="relative flex h-full items-center justify-center overflow-auto py-12">
      {/* Background gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative w-full max-w-6xl space-y-12 text-center">
        {/* Status badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-6 py-3 text-sm backdrop-blur-sm">
            <Clock className="mr-2 size-4" />
            <span className="font-medium">Coming Soon</span>
          </div>
        </div>

        {/* Icon with gradient background */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-primary/20 to-primary/10 blur-2xl" />
            <div className="relative flex size-32 items-center justify-center rounded-full border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm">
              <GraduationCap
                className="size-16 text-primary"
                strokeWidth={1.5}
              />
            </div>
          </div>
        </div>

        {/* Main heading with gradient */}
        <div className="space-y-4">
          <h1 className="font-bold text-5xl tracking-tight md:text-6xl">
            Training{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text font-extrabold text-transparent dark:from-blue-400 dark:to-blue-300">
              Center
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-foreground/60 text-xl leading-relaxed">
            A comprehensive learning management system bringing together company
            training, industry partnerships, and professional certifications -
            all in one place.
          </p>
        </div>

        {/* Feature Categories */}
        <div className="mx-auto max-w-5xl space-y-8 pt-8">
          {/* Primary Features */}
          <div>
            <h2 className="mb-6 font-semibold text-2xl">
              Core Training Features
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="group hover:-translate-y-1 rounded-2xl border border-primary/10 bg-gradient-to-br from-blue-500/5 to-transparent p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-blue-500/10 hover:shadow-lg">
                <div className="mb-4 flex justify-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                    <Building2 className="size-6 text-primary dark:text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-lg">System Training</h3>
                <p className="text-muted-foreground text-sm">
                  Master every feature of the Thorbis platform with step-by-step
                  video tutorials and guides
                </p>
              </div>

              <div className="group hover:-translate-y-1 rounded-2xl border border-primary/10 bg-gradient-to-br from-green-500/5 to-transparent p-6 transition-all duration-300 hover:border-success/20 hover:shadow-green-500/10 hover:shadow-lg">
                <div className="mb-4 flex justify-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-success/10">
                    <TrendingUp className="size-6 text-success dark:text-success" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-lg">Sales Training</h3>
                <p className="text-muted-foreground text-sm">
                  Close more deals with proven sales techniques and customer
                  service excellence courses
                </p>
              </div>

              <div className="group hover:-translate-y-1 rounded-2xl border border-primary/10 bg-gradient-to-br from-purple-500/5 to-transparent p-6 transition-all duration-300 hover:border-border/20 hover:shadow-lg hover:shadow-purple-500/10">
                <div className="mb-4 flex justify-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-accent/10">
                    <Star className="size-6 text-accent-foreground dark:text-accent-foreground" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-lg">Nextstar</h3>
                <p className="text-muted-foreground text-sm">
                  Access exclusive training from the nation's premier coaching
                  organization for home services
                </p>
              </div>

              <div className="group hover:-translate-y-1 rounded-2xl border border-primary/10 bg-gradient-to-br from-orange-500/5 to-transparent p-6 transition-all duration-300 hover:border-warning/20 hover:shadow-lg hover:shadow-orange-500/10">
                <div className="mb-4 flex justify-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-warning/10">
                    <Wrench className="size-6 text-warning dark:text-warning" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-lg">Trade Certs</h3>
                <p className="text-muted-foreground text-sm">
                  Journeyman and Master certification programs for HVAC,
                  Plumbing, and Electrical trades
                </p>
              </div>
            </div>
          </div>

          {/* Company Training Features */}
          <div>
            <h2 className="mb-6 font-semibold text-2xl">
              Company Training Tools
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-6 text-left">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Upload className="size-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Video Upload</h3>
                <p className="text-muted-foreground text-sm">
                  Upload and organize your own training videos for team access
                </p>
              </div>

              <div className="rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-6 text-left">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="size-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Curriculum Builder</h3>
                <p className="text-muted-foreground text-sm">
                  Create custom curricula tailored to your company processes
                </p>
              </div>

              <div className="rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-6 text-left">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Briefcase className="size-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Company Courses</h3>
                <p className="text-muted-foreground text-sm">
                  Build courses specific to your standards and best practices
                </p>
              </div>
            </div>
          </div>

          {/* Certification Programs */}
          <div>
            <h2 className="mb-6 font-semibold text-2xl">
              Professional Certifications
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-warning/20 bg-gradient-to-br from-orange-500/10 to-transparent p-6 text-left">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-warning/10">
                    <Wrench className="size-6 text-warning dark:text-warning" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Journeyman Programs
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      8-12 months • 120 hours
                    </p>
                  </div>
                </div>
                <p className="mb-3 text-muted-foreground text-sm">
                  Comprehensive training and assessments for state-recognized
                  journeyman certification
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-1 text-xs">
                    <CheckCircle2 className="size-3" />
                    HVAC
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-1 text-xs">
                    <CheckCircle2 className="size-3" />
                    Plumbing
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-1 text-xs">
                    <CheckCircle2 className="size-3" />
                    Electrical
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-warning/20 bg-gradient-to-br from-yellow-500/10 to-transparent p-6 text-left">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-warning/10">
                    <Shield className="size-6 text-warning dark:text-warning" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Master Certification
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      12-24 months • 200 hours
                    </p>
                  </div>
                </div>
                <p className="mb-3 text-muted-foreground text-sm">
                  Advanced expertise with leadership courses and
                  industry-certified credentials
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-warning/10 px-2 py-1 text-xs">
                    Advanced Training
                  </span>
                  <span className="rounded-full bg-warning/10 px-2 py-1 text-xs">
                    Leadership
                  </span>
                  <span className="rounded-full bg-warning/10 px-2 py-1 text-xs">
                    Industry Certified
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Features */}
          <div>
            <h2 className="mb-6 font-semibold text-2xl">
              Learning Management Features
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center gap-2 rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="size-5 text-primary" />
                </div>
                <span className="font-medium text-sm">Progress Tracking</span>
              </div>

              <div className="flex flex-col items-center gap-2 rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="size-5 text-primary" />
                </div>
                <span className="font-medium text-sm">Assessments</span>
              </div>

              <div className="flex flex-col items-center gap-2 rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Award className="size-5 text-primary" />
                </div>
                <span className="font-medium text-sm">Certificates</span>
              </div>

              <div className="flex flex-col items-center gap-2 rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="size-5 text-primary" />
                </div>
                <span className="font-medium text-sm">Team Analytics</span>
              </div>
            </div>
          </div>

          {/* What to Expect */}
          <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-8">
            <div className="mb-6 flex justify-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                <Lightbulb className="size-8 text-primary" />
              </div>
            </div>
            <h2 className="mb-4 font-semibold text-2xl">What to Expect</h2>
            <div className="mx-auto max-w-3xl space-y-3 text-left text-muted-foreground">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success dark:text-success" />
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    Thorbis System Training:
                  </span>{" "}
                  Master every feature with video tutorials, interactive guides,
                  and hands-on exercises
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success dark:text-success" />
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    Sales & Customer Service:
                  </span>{" "}
                  Proven techniques to close more deals and deliver exceptional
                  customer experiences
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success dark:text-success" />
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    Nextstar Partnership:
                  </span>{" "}
                  Access exclusive content from the nation's premier coaching
                  organization - all integrated in one platform
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success dark:text-success" />
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    Trade Certifications:
                  </span>{" "}
                  Real curriculum for journeyman and master certifications with
                  EPA, NATE, and state licensing prep
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success dark:text-success" />
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    Company Training:
                  </span>{" "}
                  Upload your own videos, create custom curricula, and build
                  courses specific to your processes
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success dark:text-success" />
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    Progress & Analytics:
                  </span>{" "}
                  Track individual and team progress, completion rates, and
                  certification status
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="flex items-center justify-center gap-2 pt-4 text-muted-foreground text-sm">
          <Rocket className="size-4" />
          <p>
            In the meantime, explore the platform and reach out if you need help
          </p>
        </div>
      </div>
    </div>
  );
}
