/**
 * Optimized Email List Item Component
 * 
 * Memoized component to prevent unnecessary re-renders
 * Only re-renders when email data or selection state changes
 */

"use client";

import { memo } from "react";
import type { CompanyEmail } from "@/actions/email-actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, AlertTriangle, Archive } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailListItemProps {
    email: CompanyEmail;
    isSelected: boolean;
    onSelect: (email: CompanyEmail) => void;
    onStar: (emailId: string) => void;
    onToggleSpam: (emailId: string) => void;
    onArchive: (emailId: string) => void;
}

export const EmailListItem = memo(function EmailListItem({
    email,
    isSelected,
    onSelect,
    onStar,
    onToggleSpam,
    onArchive,
}: EmailListItemProps) {
    const tags = (email.tags as string[]) || [];
    const isStarred = tags.includes("starred");
    const isSpam = tags.includes("spam") || email.category === "spam";
    const isUnread = !email.read_at;

    return (
        <div className="select-none md:my-1">
            <div
                className={cn(
                    "hover:bg-accent group flex cursor-pointer flex-col items-start rounded-lg py-2 text-left text-sm transition-all hover:opacity-100 relative",
                    isSelected && "bg-accent opacity-100",
                    !isUnread && "opacity-60"
                )}
                onClick={() => onSelect(email)}
            >
                {/* Hover Action Toolbar */}
                <div
                    className="dark:bg-panelDark absolute right-2 z-25 flex -translate-y-1/2 items-center gap-1 rounded-xl border bg-white p-1 opacity-0 shadow-sm group-hover:opacity-100 top-[-1] transition-opacity duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 overflow-visible p-0 hover:bg-accent group/star"
                        onClick={(e) => {
                            e.stopPropagation();
                            onStar(email.id);
                        }}
                        title={isStarred ? "Unstar" : "Star"}
                    >
                        <Star
                            className={cn(
                                "h-4 w-4 transition-colors group-hover/star:text-yellow-500 dark:group-hover/star:text-yellow-400",
                                isStarred
                                    ? "fill-yellow-500 text-yellow-500 dark:fill-yellow-400 dark:text-yellow-400"
                                    : "text-muted-foreground"
                            )}
                        />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-accent group/spam"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleSpam(email.id);
                        }}
                        title={isSpam ? "Remove from spam" : "Mark as spam"}
                    >
                        <AlertTriangle
                            className={cn(
                                "h-4 w-4 transition-colors group-hover/spam:text-orange-500 dark:group-hover/spam:text-orange-400",
                                isSpam
                                    ? "fill-orange-500 text-orange-500 dark:fill-orange-400 dark:text-orange-400"
                                    : "text-muted-foreground"
                            )}
                        />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-accent group/archive"
                        onClick={(e) => {
                            e.stopPropagation();
                            onArchive(email.id);
                        }}
                        title="Archive"
                    >
                        <Archive className="h-4 w-4 text-muted-foreground transition-colors group-hover/archive:text-blue-500 dark:group-hover/archive:text-blue-400" />
                    </Button>
                </div>

                {/* Email Card Content */}
                <div className="relative flex w-full items-center justify-between gap-4 px-2">
                    <Avatar className="h-8 w-8 shrink-0 rounded-full border">
                        <AvatarFallback className="bg-white dark:bg-[#373737] text-[#9F9F9D] font-bold text-xs">
                            {(() => {
                                // Use customer name if available, otherwise use email/name
                                const displayName = (email.customer as any)?.display_name || 
                                                   ((email.customer as any)?.first_name && (email.customer as any)?.last_name 
                                                    ? `${(email.customer as any).first_name} ${(email.customer as any).last_name}` 
                                                    : null) ||
                                                   email.from_name ||
                                                   (typeof email.from_address === 'string' ? email.from_address : email.from_address?.[0] || "");
                                return displayName?.[0]?.toUpperCase() || "U";
                            })()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex w-full justify-between">
                        <div className="w-full">
                            <div className="flex w-full flex-row items-center justify-between">
                                <div className="flex flex-row items-center gap-[4px]">
                                    <span className={cn("font-bold text-md flex items-baseline gap-1 group-hover:opacity-100")}>
                                        <div className="flex items-center gap-1">
                                            <span className="line-clamp-1 overflow-hidden text-sm">
                                                {(() => {
                                                    // Prioritize customer name, then from_name, then from_address
                                                    const customer = email.customer as any;
                                                    if (customer?.display_name) {
                                                        return customer.display_name;
                                                    }
                                                    if (customer?.first_name && customer?.last_name) {
                                                        return `${customer.first_name} ${customer.last_name}`;
                                                    }
                                                    if (email.from_name) {
                                                        return email.from_name;
                                                    }
                                                    // Ensure from_address is a string, not an array
                                                    const fromAddr = typeof email.from_address === 'string' 
                                                        ? email.from_address 
                                                        : (Array.isArray(email.from_address) ? email.from_address[0] : email.from_address);
                                                    return fromAddr || "Unknown";
                                                })()}
                                            </span>
                                            {isUnread && (
                                                <span className="ml-0.5 size-2 rounded-full bg-[#006FFE]"></span>
                                            )}
                                        </div>
                                    </span>
                                </div>
                                <p className="text-muted-foreground text-nowrap text-xs font-normal opacity-70 transition-opacity group-hover:opacity-100 dark:text-[#8C8C8C]">
                                    {email.created_at
                                        ? new Date(email.created_at).toLocaleTimeString([], {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                          })
                                        : ""}
                                </p>
                            </div>

                            <div className="flex justify-between">
                                <p className="mt-1 line-clamp-1 w-[95%] min-w-0 overflow-hidden text-sm text-[#8C8C8C]">
                                    {email.subject || "No subject"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    // Custom comparison function for React.memo
    // Only re-render if these props actually change
    return (
        prevProps.email.id === nextProps.email.id &&
        prevProps.email.read_at === nextProps.email.read_at &&
        prevProps.email.tags === nextProps.email.tags &&
        prevProps.email.category === nextProps.email.category &&
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.email.subject === nextProps.email.subject &&
        prevProps.email.from_address === nextProps.email.from_address &&
        prevProps.email.created_at === nextProps.email.created_at
    );
});

