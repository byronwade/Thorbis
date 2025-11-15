"use client";

import { Building2, CheckCircle2, LogOut, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/actions/auth";
import { switchCompany } from "@/actions/company-context";
import { updateUserStatus, type UserStatus } from "@/actions/user-status";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusIndicator } from "@/components/ui/status-indicator";
import type { UserProfile } from "@/lib/auth/user-data";

interface OnboardingHeaderClientProps {
  userProfile: UserProfile;
  companies: Array<{
    id: string;
    name: string;
    plan: string;
    onboardingComplete?: boolean;
    hasPayment?: boolean;
  }>;
}

export function OnboardingHeaderClient({
  userProfile,
  companies,
}: OnboardingHeaderClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [userStatus, setUserStatus] = useState<UserStatus>(
    userProfile.status || "online"
  );
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Use companies passed as props, which already include onboarding status from the API
  const companiesWithStatus = companies.map((company) => ({
    id: company.id,
    name: company.name,
    plan: company.plan,
    onboardingComplete: company.onboardingComplete ?? false,
    hasPayment: company.hasPayment ?? false,
  }));

  const handleCompanySwitch = async (
    companyId: string,
    onboardingComplete: boolean
  ) => {
    const result = await switchCompany(companyId);
    if (result.success) {
      // If onboarding is not complete and not on welcome page, redirect to onboarding
      if (!onboardingComplete && pathname !== "/dashboard/welcome") {
        router.push("/dashboard/welcome");
      } else {
        // Stay on current page and refresh data
        router.refresh();
      }
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleStatusChange = async (status: UserStatus) => {
    setIsUpdatingStatus(true);
    try {
      const result = await updateUserStatus(status);
      if (result.success) {
        setUserStatus(status);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-header-bg">
      <div className="flex h-14 items-center gap-2 px-4">
        {/* Logo */}
        <Link
          className="flex size-8 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all hover:border-primary/20 hover:bg-primary/10 hover:text-primary focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:hover:bg-accent/50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
          href="/dashboard"
        >
          <Image
            alt="Thorbis"
            className="size-5"
            height={20}
            src="/ThorbisLogo.webp"
            width={20}
          />
          <span className="sr-only">Thorbis</span>
        </Link>

        {/* Right: User Menu */}
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex h-8 items-center gap-2 rounded-md px-2 outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
                type="button"
              >
                <div className="relative">
                  <Avatar className="size-6 rounded-md">
                    <AvatarImage
                      alt={userProfile.name}
                      src={userProfile.avatar}
                    />
                    <AvatarFallback className="rounded-md text-[10px]">
                      {userProfile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5">
                    <StatusIndicator status={userStatus} size="sm" />
                  </div>
                </div>
                <span className="hidden font-medium text-sm md:inline-block">
                  {userProfile.name.split(" ")[0]}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-lg">
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <div className="relative">
                    <Avatar className="size-8 rounded-lg">
                      <AvatarImage
                        alt={userProfile.name}
                        src={userProfile.avatar}
                      />
                      <AvatarFallback className="rounded-lg">
                        {userProfile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5">
                      <StatusIndicator status={userStatus} size="md" />
                    </div>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {userProfile.name}
                    </span>
                    <span className="truncate text-xs">
                      {userProfile.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Status Selector */}
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Status
              </DropdownMenuLabel>
              <div className="px-2 pb-2">
                <div className="space-y-1">
                  <button
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent ${
                      userStatus === "online" ? "bg-accent" : ""
                    }`}
                    disabled={isUpdatingStatus}
                    onClick={() => handleStatusChange("online")}
                    type="button"
                  >
                    <StatusIndicator status="online" size="md" />
                    <span>Online</span>
                    {userStatus === "online" && (
                      <div className="ml-auto size-2 rounded-full bg-primary" />
                    )}
                  </button>
                  <button
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent ${
                      userStatus === "available" ? "bg-accent" : ""
                    }`}
                    disabled={isUpdatingStatus}
                    onClick={() => handleStatusChange("available")}
                    type="button"
                  >
                    <StatusIndicator status="available" size="md" />
                    <span>Available</span>
                    {userStatus === "available" && (
                      <div className="ml-auto size-2 rounded-full bg-primary" />
                    )}
                  </button>
                  <button
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent ${
                      userStatus === "busy" ? "bg-accent" : ""
                    }`}
                    disabled={isUpdatingStatus}
                    onClick={() => handleStatusChange("busy")}
                    type="button"
                  >
                    <StatusIndicator status="busy" size="md" />
                    <span>Busy</span>
                    {userStatus === "busy" && (
                      <div className="ml-auto size-2 rounded-full bg-primary" />
                    )}
                  </button>
                </div>
              </div>
              <DropdownMenuSeparator />

              {/* Companies */}
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Organizations
              </DropdownMenuLabel>
              {companiesWithStatus.map((company) => (
                <DropdownMenuItem
                  className="gap-2 p-2"
                  key={company.id}
                  onClick={() =>
                    handleCompanySwitch(company.id, company.onboardingComplete)
                  }
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Building2 className="size-4 shrink-0" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="font-medium text-sm">{company.name}</span>
                    <div className="flex items-center gap-2">
                      {company.onboardingComplete ? (
                        <Badge
                          className="h-4 px-1.5 text-[10px]"
                          variant="default"
                        >
                          <CheckCircle2 className="mr-1 size-3" />
                          Complete
                        </Badge>
                      ) : (
                        <Badge
                          className="h-4 px-1.5 text-[10px]"
                          variant="secondary"
                        >
                          <XCircle className="mr-1 size-3" />
                          Not Complete
                        </Badge>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem asChild className="gap-2 p-2">
                <Link href="/dashboard/welcome?new=true">
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <Building2 className="size-4" />
                  </div>
                  <span className="font-medium text-muted-foreground">
                    Add new business
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="text-destructive" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
