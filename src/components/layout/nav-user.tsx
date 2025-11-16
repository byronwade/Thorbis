"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type UserStatus, updateUserStatus } from "@/actions/user-status";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { StatusIndicator } from "@/components/ui/status-indicator";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
    status?: UserStatus;
  };
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userStatus, setUserStatus] = useState<UserStatus>(
    user.status || "online"
  );
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStatusChange = async (status: UserStatus) => {
    setIsUpdatingStatus(true);
    try {
      const result = await updateUserStatus(status);
      if (result.success) {
        setUserStatus(status);
        router.refresh();
      }
    } catch (_error) {
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Prevent SSR hydration mismatch with Radix UI IDs
  if (!mounted) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton className="h-10" size="lg">
            <div className="relative">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage alt={user.name} src={user.avatar} />
                <AvatarFallback className="rounded-lg">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="-bottom-0.5 -right-0.5 absolute">
                <StatusIndicator size="sm" status={userStatus} />
              </div>
            </div>
            <div className="grid flex-1 text-left leading-[1.2]">
              <span className="truncate font-semibold text-sm">
                {user.name}
              </span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="h-10 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              size="lg"
            >
              <div className="relative">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage alt={user.name} src={user.avatar} />
                  <AvatarFallback className="rounded-lg">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="-bottom-0.5 -right-0.5 absolute">
                  <StatusIndicator size="sm" status={userStatus} />
                </div>
              </div>
              <div className="grid flex-1 text-left leading-[1.2]">
                <span className="truncate font-semibold text-sm">
                  {user.name}
                </span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="relative">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage alt={user.name} src={user.avatar} />
                    <AvatarFallback className="rounded-lg">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="-bottom-0.5 -right-0.5 absolute">
                    <StatusIndicator size="md" status={userStatus} />
                  </div>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
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
                  <StatusIndicator size="md" status="online" />
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
                  <StatusIndicator size="md" status="available" />
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
                  <StatusIndicator size="md" status="busy" />
                  <span>Busy</span>
                  {userStatus === "busy" && (
                    <div className="ml-auto size-2 rounded-full bg-primary" />
                  )}
                </button>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
