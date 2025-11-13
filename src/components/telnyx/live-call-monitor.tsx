"use client";

/**
 * Live Call Monitor - Real-time call tracking dashboard
 *
 * Features:
 * - Live call status updates
 * - Active calls list with duration
 * - Queue status monitoring
 * - Team member availability
 * - Quick actions (transfer, hold, etc.)
 */

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneOff,
  TrendingUp,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";

type ActiveCall = {
  id: string;
  call_sid: string;
  direction: "inbound" | "outbound";
  from_number: string;
  to_number: string;
  call_status: string;
  team_member_id: string | null;
  team_member_name: string | null;
  started_at: string;
  answered_at: string | null;
  duration_seconds: number;
};

type QueuedCall = {
  id: string;
  caller_phone_number: string;
  caller_name: string | null;
  queue_position: number;
  wait_time_seconds: number;
  queued_at: string;
};

type TeamMemberStatus = {
  id: string;
  full_name: string;
  phone_extension: string | null;
  status: string;
  can_receive_calls: boolean;
  current_calls_count: number;
  max_concurrent_calls: number;
};

export function LiveCallMonitor() {
  const [activeCalls, setActiveCalls] = useState<ActiveCall[]>([]);
  const [queuedCalls, setQueuedCalls] = useState<QueuedCall[]>([]);
  const [teamStatus, setTeamStatus] = useState<TeamMemberStatus[]>([]);
  const [stats, setStats] = useState({
    activeCallsCount: 0,
    queuedCallsCount: 0,
    availableAgents: 0,
    avgWaitTime: 0,
  });

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    // Initial data load
    loadActiveCalls();
    loadQueuedCalls();
    loadTeamStatus();

    // Subscribe to real-time updates
    const callsChannel = supabase
      .channel("live-calls")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "call_logs",
          filter: "call_status=in.('initiated','in-progress')",
        },
        (payload) => {
          console.log("Call update:", payload);
          loadActiveCalls();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "call_queue",
          filter: "status=eq.waiting",
        },
        (payload) => {
          console.log("Queue update:", payload);
          loadQueuedCalls();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "team_availability",
        },
        (payload) => {
          console.log("Team status update:", payload);
          loadTeamStatus();
        }
      )
      .subscribe();

    // Update call durations every second
    const durationInterval = setInterval(() => {
      setActiveCalls((prevCalls) =>
        prevCalls.map((call) => ({
          ...call,
          duration_seconds: call.answered_at
            ? Math.floor(
                (Date.now() - new Date(call.answered_at).getTime()) / 1000
              )
            : 0,
        }))
      );

      setQueuedCalls((prevCalls) =>
        prevCalls.map((call) => ({
          ...call,
          wait_time_seconds: Math.floor(
            (Date.now() - new Date(call.queued_at).getTime()) / 1000
          ),
        }))
      );
    }, 1000);

    return () => {
      supabase.removeChannel(callsChannel);
      clearInterval(durationInterval);
    };
  }, []);

  async function loadActiveCalls() {
    const supabase = createClient();
    if (!supabase) return;
    const { data, error } = await supabase
      .from("call_logs")
      .select(
        `
        id,
        call_sid,
        direction,
        from_number,
        to_number,
        call_status,
        team_member_id,
        started_at,
        answered_at,
        duration_seconds,
        team_members (
          full_name
        )
      `
      )
      .in("call_status", ["initiated", "in-progress"])
      .order("started_at", { ascending: false });

    if (!error && data) {
      setActiveCalls(
        data.map((call: any) => ({
          ...call,
          team_member_name: call.team_members?.full_name || null,
        }))
      );
      setStats((prev) => ({ ...prev, activeCallsCount: data.length }));
    }
  }

  async function loadQueuedCalls() {
    const supabase = createClient();
    if (!supabase) return;
    const { data, error } = await supabase
      .from("call_queue")
      .select("*")
      .eq("status", "waiting")
      .order("queue_position");

    if (!error && data) {
      setQueuedCalls(data);
      setStats((prev) => ({ ...prev, queuedCallsCount: data.length }));

      if (data.length > 0) {
        const avgWait =
          data.reduce((sum, call) => sum + (call.wait_time_seconds || 0), 0) /
          data.length;
        setStats((prev) => ({ ...prev, avgWaitTime: Math.floor(avgWait) }));
      }
    }
  }

  async function loadTeamStatus() {
    const supabase = createClient();
    if (!supabase) return;
    const { data, error } = await supabase
      .from("team_members")
      .select(
        `
        id,
        full_name,
        phone_extension,
        team_availability (
          status,
          can_receive_calls,
          current_calls_count,
          max_concurrent_calls
        )
      `
      )
      .eq("extension_enabled", true)
      .not("phone_extension", "is", null);

    if (!error && data) {
      const teamData = data.map((member: any) => ({
        id: member.id,
        full_name: member.full_name,
        phone_extension: member.phone_extension,
        status: member.team_availability?.[0]?.status || "offline",
        can_receive_calls: member.team_availability?.[0]?.can_receive_calls,
        current_calls_count:
          member.team_availability?.[0]?.current_calls_count || 0,
        max_concurrent_calls:
          member.team_availability?.[0]?.max_concurrent_calls || 3,
      }));

      setTeamStatus(teamData);
      const available = teamData.filter((m) => m.can_receive_calls).length;
      setStats((prev) => ({ ...prev, availableAgents: available }));
    }
  }

  function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  function formatPhoneNumber(number: string): string {
    // Format: +1 (555) 123-4567
    const cleaned = number.replace(/\D/g, "");
    if (cleaned.length === 11 && cleaned.startsWith("1")) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return number;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "busy":
        return "bg-yellow-500";
      case "away":
        return "bg-orange-500";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Active Calls</CardTitle>
            <PhoneCall className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stats.activeCallsCount}</div>
            <p className="text-muted-foreground text-xs">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Queue</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stats.queuedCallsCount}</div>
            <p className="text-muted-foreground text-xs">
              Avg wait: {formatDuration(stats.avgWaitTime)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Available Agents
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stats.availableAgents}</div>
            <p className="text-muted-foreground text-xs">
              of {teamStatus.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Capacity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {Math.round(
                (stats.activeCallsCount / Math.max(teamStatus.length * 3, 1)) *
                  100
              )}
              %
            </div>
            <Progress
              className="mt-2"
              value={
                (stats.activeCallsCount / Math.max(teamStatus.length * 3, 1)) *
                100
              }
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Calls */}
        <Card>
          <CardHeader>
            <CardTitle>Active Calls</CardTitle>
            <CardDescription>Calls currently in progress</CardDescription>
          </CardHeader>
          <CardContent>
            {activeCalls.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-center text-muted-foreground">
                <div>
                  <PhoneOff className="mx-auto mb-2 h-8 w-8" />
                  <p>No active calls</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {activeCalls.map((call) => (
                  <div
                    className="flex items-start justify-between rounded-lg border p-3"
                    key={call.id}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {call.direction === "inbound" ? (
                          <PhoneIncoming className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Phone className="h-4 w-4 text-green-500" />
                        )}
                        <span className="font-medium">
                          {formatPhoneNumber(
                            call.direction === "inbound"
                              ? call.from_number
                              : call.to_number
                          )}
                        </span>
                      </div>
                      {call.team_member_name && (
                        <div className="mt-1 flex items-center gap-2 text-muted-foreground text-sm">
                          <User className="h-3 w-3" />
                          {call.team_member_name}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          call.call_status === "in-progress"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {call.call_status === "in-progress"
                          ? formatDuration(call.duration_seconds)
                          : "Ringing"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Call Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Call Queue</CardTitle>
            <CardDescription>Calls waiting for available agent</CardDescription>
          </CardHeader>
          <CardContent>
            {queuedCalls.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-center text-muted-foreground">
                <div>
                  <CheckCircle2 className="mx-auto mb-2 h-8 w-8" />
                  <p>Queue is empty</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {queuedCalls.map((call) => (
                  <div
                    className="flex items-start justify-between rounded-lg border p-3"
                    key={call.id}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium font-mono text-lg">
                          #{call.queue_position}
                        </span>
                        <span className="font-medium">
                          {formatPhoneNumber(call.caller_phone_number)}
                        </span>
                      </div>
                      {call.caller_name && (
                        <div className="mt-1 text-muted-foreground text-sm">
                          {call.caller_name}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <Clock className="h-3 w-3" />
                        {formatDuration(call.wait_time_seconds)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Team Status */}
      <Card>
        <CardHeader>
          <CardTitle>Team Status</CardTitle>
          <CardDescription>Real-time agent availability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {teamStatus.map((member) => (
              <div
                className="flex items-center justify-between rounded-lg border p-3"
                key={member.id}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${getStatusColor(member.status)}`}
                  />
                  <div>
                    <div className="font-medium">{member.full_name}</div>
                    <div className="text-muted-foreground text-xs">
                      Ext {member.phone_extension}
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="font-medium">
                    {member.current_calls_count}/{member.max_concurrent_calls}
                  </div>
                  <div className="text-muted-foreground text-xs">calls</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {queuedCalls.some((c) => c.wait_time_seconds > 180) && (
        <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-warning dark:text-orange-400" />
            <div>
              <p className="font-medium text-orange-900 text-sm dark:text-orange-100">
                Long Wait Times Detected
              </p>
              <p className="text-sm text-warning dark:text-orange-300">
                {queuedCalls.filter((c) => c.wait_time_seconds > 180).length}{" "}
                caller(s) waiting over 3 minutes. Consider adding more agents or
                enabling voicemail.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
