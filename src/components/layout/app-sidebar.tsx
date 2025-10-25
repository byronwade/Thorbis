"use client";

import { HelpCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChatStore, chatSelectors } from "@/lib/store/chat-store";
import { MessageIcon, PlusIcon, TrashIcon } from "@/components/chat/icons";
import { Button } from "@/components/ui/button";

// Navigation configuration - focused on daily field service operations
const navigationSections = {
  dashboard: [
    {
      title: "Today's Overview",
      href: "/dashboard",
    },
    {
      title: "Revenue Dashboard",
      href: "/dashboard/revenue",
    },
    {
      title: "Active Jobs",
      href: "/dashboard/active-jobs",
    },
    {
      title: "Technician Status",
      href: "/dashboard/technician-status",
    },
  ],
  communication: [
    {
      title: "Unified Inbox",
      href: "/dashboard/communication",
    },
    {
      title: "Phone Calls",
      href: "/dashboard/communication/calls",
    },
    {
      title: "Text Messages",
      href: "/dashboard/communication/sms",
    },
    {
      title: "Email Management",
      href: "/dashboard/communication/email",
    },
  ],
  schedule: [
    {
      title: "Today's Schedule",
      href: "/dashboard/schedule",
    },
    {
      title: "Dispatch Board",
      href: "/dashboard/schedule/dispatch",
    },
    {
      title: "Route Planning",
      href: "/dashboard/schedule/routes",
    },
    {
      title: "Time Tracking",
      href: "/dashboard/schedule/time",
    },
  ],
  customers: [
    {
      title: "Customer Database",
      href: "/dashboard/customers",
    },
    {
      title: "Service History",
      href: "/dashboard/customers/history",
    },
    {
      title: "Communications",
      href: "/dashboard/customers/communication",
    },
    {
      title: "Reviews & Feedback",
      href: "/dashboard/customers/feedback",
    },
  ],
  finance: [
    {
      title: "Financial Dashboard",
      href: "/dashboard/finance",
    },
    {
      title: "Create Invoice",
      href: "/dashboard/finance/invoicing",
    },
    {
      title: "Payment Processing",
      href: "/dashboard/finance/payments",
    },
    {
      title: "Payroll",
      href: "/dashboard/finance/payroll",
    },
  ],
  reports: [
    {
      title: "Business Analytics",
      href: "/dashboard/reports",
    },
    {
      title: "Financial Reports",
      href: "/dashboard/reports/financial",
    },
    {
      title: "Operational Reports",
      href: "/dashboard/reports/operational",
    },
    {
      title: "Custom Reports",
      href: "/dashboard/reports/custom",
    },
  ],
  marketing: [
    {
      title: "Lead Management",
      href: "/dashboard/marketing",
    },
    {
      title: "Review Management",
      href: "/dashboard/marketing/reviews",
    },
    {
      title: "Marketing Campaigns",
      href: "/dashboard/marketing/campaigns",
    },
    {
      title: "Customer Outreach",
      href: "/dashboard/marketing/outreach",
    },
  ],
  settings: [
    {
      title: "Company Profile",
      href: "/dashboard/settings",
    },
    {
      title: "Team Management",
      href: "/dashboard/settings/users",
    },
    {
      title: "Integrations",
      href: "/dashboard/settings/integrations",
      badge: true,
    },
    {
      title: "System Settings",
      href: "/dashboard/settings/system",
    },
  ],
  ai: [
    {
      title: "Stratos Assistant",
      href: "/dashboard/ai",
    },
    {
      title: "Smart Suggestions",
      href: "/dashboard/ai/suggestions",
    },
    {
      title: "Automation Rules",
      href: "/dashboard/ai/automation",
    },
    {
      title: "AI Analytics",
      href: "/dashboard/ai/analytics",
    },
  ],
  // Essential field service modules
  pricebook: [
    {
      title: "Service Pricing",
      href: "/dashboard/pricebook",
    },
    {
      title: "Parts & Materials",
      href: "/dashboard/pricebook/parts",
    },
    {
      title: "Labor Rates",
      href: "/dashboard/pricebook/labor",
    },
    {
      title: "Service Packages",
      href: "/dashboard/pricebook/packages",
    },
  ],
  inventory: [
    {
      title: "Stock Levels",
      href: "/dashboard/inventory",
    },
    {
      title: "Parts Management",
      href: "/dashboard/inventory/parts",
    },
    {
      title: "Purchase Orders",
      href: "/dashboard/inventory/purchase-orders",
    },
    {
      title: "Vendor Management",
      href: "/dashboard/inventory/vendors",
    },
  ],
  technicians: [
    {
      title: "Technician Roster",
      href: "/dashboard/technicians",
    },
    {
      title: "Skills & Certifications",
      href: "/dashboard/technicians/skills",
    },
    {
      title: "Performance Tracking",
      href: "/dashboard/technicians/performance",
    },
    {
      title: "Time & Attendance",
      href: "/dashboard/technicians/attendance",
    },
  ],
};

// Function to get current section based on pathname
function getCurrentSection(pathname: string): keyof typeof navigationSections {
  if (pathname.startsWith("/dashboard/communication")) {
    return "communication";
  }
  if (pathname.startsWith("/dashboard/schedule")) {
    return "schedule";
  }
  if (pathname.startsWith("/dashboard/customers")) {
    return "customers";
  }
  if (pathname.startsWith("/dashboard/finance")) {
    return "finance";
  }
  if (pathname.startsWith("/dashboard/reports")) {
    return "reports";
  }
  if (pathname.startsWith("/dashboard/marketing")) {
    return "marketing";
  }
  if (pathname.startsWith("/dashboard/ai")) {
    return "ai";
  }
  if (pathname.startsWith("/dashboard/settings")) {
    return "settings";
  }
  if (pathname.startsWith("/dashboard/pricebook")) {
    return "pricebook";
  }
  if (pathname.startsWith("/dashboard/inventory")) {
    return "inventory";
  }
  if (pathname.startsWith("/dashboard/technicians")) {
    return "technicians";
  }
  if (pathname.startsWith("/dashboard/training")) {
    return "training";
  }
  return "dashboard";
}

export function AppSidebar() {
	const pathname = usePathname();
	const currentSection = getCurrentSection(pathname);
	const currentNavigation = navigationSections[currentSection];

	// Get chat store for AI section
	const chats = useChatStore(chatSelectors.chats);
	const activeChatId = useChatStore(chatSelectors.activeChatId);
	const { createChat, setActiveChat, deleteChat } = useChatStore();
	const isAISection = currentSection === "ai";

	const handleNewChat = () => {
		const chatId = createChat();
		setActiveChat(chatId);
		// Navigate to AI chat
		window.location.href = "/dashboard/ai";
	};

	const handleSelectChat = (chatId: string) => {
		setActiveChat(chatId);
	};

	const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
		e.preventDefault();
		e.stopPropagation();
		deleteChat(chatId);
	};

	return (
		<div className="hidden h-full w-48 flex-col bg-transparent text-sidebar-foreground lg:flex" data-slot="sidebar">
			{/* Main Content */}
			<div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-auto overflow-x-hidden group-data-[collapsible=icon]:overflow-hidden" data-sidebar="content" data-slot="sidebar-content">
				<div className="relative flex w-full min-w-0 flex-col p-2" data-sidebar="group" data-slot="sidebar-group">
					<div className="group-data-[collapsible=icon]:-mt-8 flex h-8 shrink-0 items-center justify-between rounded-md px-2 font-medium text-muted-foreground text-xs outline-hidden ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 group-data-[collapsible=icon]:opacity-0 [&>svg]:size-4 [&>svg]:shrink-0" data-sidebar="group-label" data-slot="sidebar-group-label">
						<span>{currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}</span>
						{isAISection && (
							<Button variant="ghost" size="icon" className="size-6" onClick={handleNewChat} title="New chat">
								<PlusIcon size={12} />
							</Button>
						)}
					</div>

					<div className="w-full text-sm" data-sidebar="group-content" data-slot="sidebar-group-content">
						<ul className="flex w-full min-w-0 flex-col items-start gap-0.5" data-sidebar="menu" data-slot="sidebar-menu">
							{/* Regular navigation items */}
							{currentNavigation.map((item) => {
								const isActive = pathname === item.href;

								return (
									<li className="group/menu-item relative" data-sidebar="menu-item" data-slot="sidebar-menu-item" key={item.href}>
										<Link className="peer/menu-button relative flex h-8 w-full items-center justify-start gap-2 overflow-visible rounded-md border border-transparent px-3 py-2 text-left font-medium text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:border-accent data-[active=true]:bg-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate" data-active={isActive} data-sidebar="menu-button" data-size="default" data-slot="sidebar-menu-button" href={item.href} title={item.title}>
											<span className="truncate">{item.title}</span>
											{item.badge && <span className="flex size-1.5 flex-shrink-0 rounded-full bg-blue-500" title="New" />}
										</Link>
									</li>
								);
							})}

							{/* Chat history for AI section */}
							{isAISection && chats.length > 0 && (
								<>
									<li className="mt-2 w-full border-t pt-2">
										<div className="px-3 py-1 text-xs font-medium text-muted-foreground">Recent Chats</div>
									</li>
									{chats.slice(0, 10).map((chat) => {
										const isChatActive = activeChatId === chat.id;
										return (
											<li className="group/menu-item relative" data-sidebar="menu-item" data-slot="sidebar-menu-item" key={chat.id}>
												<button type="button" onClick={() => handleSelectChat(chat.id)} className="peer/menu-button relative flex h-8 w-full items-center justify-start gap-2 overflow-visible rounded-md border border-transparent px-3 py-2 text-left font-medium text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:border-accent data-[active=true]:bg-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate" data-active={isChatActive} data-sidebar="menu-button" data-size="default" data-slot="sidebar-menu-button" title={chat.title}>
													<MessageIcon size={14} />
													<span className="truncate">{chat.title}</span>
													<button type="button" onClick={(e) => handleDeleteChat(e, chat.id)} className="ml-auto size-5 shrink-0 opacity-0 transition-opacity hover:text-destructive group-hover/menu-item:opacity-100" title="Delete chat">
														<TrashIcon size={12} />
													</button>
												</button>
											</li>
										);
									})}
								</>
							)}
						</ul>
					</div>
				</div>
			</div>

      {/* Sidebar Footer */}
      <div className="flex-shrink-0 p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground outline-none transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
              title="Help & Support"
              type="button"
            >
              <HelpCircle className="size-4" />
              <span className="sr-only">Help & Support</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" side="top">
            <DropdownMenuLabel>Help & Support</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/help">Help Center</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/docs">Documentation</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/tutorials">Tutorials</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/feedback">Send Feedback</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/contact">Contact Support</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/keyboard-shortcuts">Keyboard Shortcuts</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
