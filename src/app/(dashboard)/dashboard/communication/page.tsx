/**
 * Communication Command Center
 * 
 * Central dashboard for all team communications
 * Provides overview, quick actions, and recent activity
 */

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Mail,
    MessageSquare,
    Phone,
    Ticket,
    Inbox,
    Send,
    Archive,
    Clock,
    AlertCircle,
    TrendingUp,
    Users,
    Activity,
    ArrowRight,
    Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getTotalUnreadCountAction, getEmailFolderCountsAction } from "@/actions/email-actions";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

type CommunicationStats = {
    unreadEmails: number;
    unreadSms: number;
    totalUnread: number;
    emailsToday: number;
    smsToday: number;
    callsToday: number;
    ticketsOpen: number;
};

type RecentCommunication = {
    id: string;
    type: "email" | "sms" | "call" | "ticket";
    subject?: string;
    from?: string;
    to?: string;
    created_at: string;
    read_at?: string | null;
    direction?: "inbound" | "outbound";
};

export default function CommunicationCommandCenter() {
    const router = useRouter();
    const [stats, setStats] = useState<CommunicationStats>({
        unreadEmails: 0,
        unreadSms: 0,
        totalUnread: 0,
        emailsToday: 0,
        smsToday: 0,
        callsToday: 0,
        ticketsOpen: 0,
    });
    const [recentCommunications, setRecentCommunications] = useState<RecentCommunication[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch communication stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [unreadResult, folderCountsResult] = await Promise.all([
                    getTotalUnreadCountAction(),
                    getEmailFolderCountsAction(),
                ]);

                if (unreadResult.success && folderCountsResult.success) {
                    setStats({
                        unreadEmails: folderCountsResult.counts?.inbox || 0,
                        unreadSms: 0, // TODO: Add SMS unread count
                        totalUnread: unreadResult.count || 0,
                        emailsToday: folderCountsResult.counts?.inbox || 0,
                        smsToday: 0, // TODO: Add SMS today count
                        callsToday: 0, // TODO: Add calls today count
                        ticketsOpen: 0, // TODO: Add tickets open count
                    });
                }
            } catch (error) {
                console.error("Failed to fetch communication stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        // Refresh every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const quickActions = [
        {
            title: "Inbox",
            description: `${stats.unreadEmails} unread emails`,
            icon: Inbox,
            href: "/dashboard/communication/email?folder=inbox",
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-50 dark:bg-blue-950",
        },
        {
            title: "Compose Email",
            description: "Send a new message",
            icon: Plus,
            href: "/dashboard/communication/email?folder=drafts",
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-50 dark:bg-green-950",
        },
        {
            title: "SMS Messages",
            description: `${stats.unreadSms} unread texts`,
            icon: MessageSquare,
            href: "/dashboard/communication/sms",
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-50 dark:bg-purple-950",
        },
        {
            title: "Call Logs",
            description: `${stats.callsToday} calls today`,
            icon: Phone,
            href: "/dashboard/communication/calls",
            color: "text-orange-600 dark:text-orange-400",
            bgColor: "bg-orange-50 dark:bg-orange-950",
        },
        {
            title: "Tickets",
            description: `${stats.ticketsOpen} open tickets`,
            icon: Ticket,
            href: "/dashboard/communication/tickets",
            color: "text-red-600 dark:text-red-400",
            bgColor: "bg-red-50 dark:bg-red-950",
        },
        {
            title: "Archive",
            description: "View archived messages",
            icon: Archive,
            href: "/dashboard/communication/email?folder=archive",
            color: "text-gray-600 dark:text-gray-400",
            bgColor: "bg-gray-50 dark:bg-gray-950",
        },
    ];

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "email":
                return Mail;
            case "sms":
                return MessageSquare;
            case "call":
                return Phone;
            case "ticket":
                return Ticket;
            default:
                return Activity;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "email":
                return "text-blue-600 dark:text-blue-400";
            case "sms":
                return "text-purple-600 dark:text-purple-400";
            case "call":
                return "text-orange-600 dark:text-orange-400";
            case "ticket":
                return "text-red-600 dark:text-red-400";
            default:
                return "text-gray-600 dark:text-gray-400";
        }
    };

    return (
        <div className="flex h-full w-full flex-col overflow-hidden bg-sidebar p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Communication Command Center</h1>
                <p className="text-muted-foreground mt-2">
                    Central hub for all team communications and customer interactions
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Stats Cards */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUnread}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.unreadEmails} emails, {stats.unreadSms} texts
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Emails Today</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.emailsToday}</div>
                        <p className="text-xs text-muted-foreground">
                            <TrendingUp className="inline h-3 w-3 mr-1" />
                            Inbound & outbound
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">SMS Today</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.smsToday}</div>
                        <p className="text-xs text-muted-foreground">
                            Messages sent & received
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Calls Today</CardTitle>
                        <Phone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.callsToday}</div>
                        <p className="text-xs text-muted-foreground">
                            Total call volume
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Jump to common communication tasks
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {quickActions.map((action) => {
                                const Icon = action.icon;
                                return (
                                    <Link
                                        key={action.title}
                                        href={action.href}
                                        className="group"
                                    >
                                        <div className={`${action.bgColor} rounded-lg p-4 transition-all hover:shadow-md`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`${action.color} rounded-lg p-2`}>
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm">{action.title}</p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {action.description}
                                                    </p>
                                                </div>
                                                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Latest communications across all channels
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px]">
                            {recentCommunications.length > 0 ? (
                                <div className="space-y-3">
                                    {recentCommunications.map((comm) => {
                                        const Icon = getTypeIcon(comm.type);
                                        const iconColor = getTypeColor(comm.type);
                                        return (
                                            <div
                                                key={comm.id}
                                                className="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                                            >
                                                <div className={`${iconColor} rounded-lg p-2`}>
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-medium truncate">
                                                            {comm.subject || comm.from || "Communication"}
                                                        </p>
                                                        {!comm.read_at && comm.direction === "inbound" && (
                                                            <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        {comm.from && `${comm.from} • `}
                                                        {formatDistanceToNow(new Date(comm.created_at), { addSuffix: true })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Activity className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                                    <p className="text-sm font-medium text-muted-foreground mb-1">
                                        No recent activity
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Communications will appear here as they come in
                                    </p>
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
