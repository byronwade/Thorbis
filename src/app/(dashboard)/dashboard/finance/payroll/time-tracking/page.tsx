/**
 * Finance > Payroll > Time Tracking Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { Check, Clock, Filter, MoreHorizontal, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const revalidate = 900; // Revalidate every 15 minutes

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock timesheet data
const timesheets = [
  {
    id: "1",
    employeeName: "John Smith",
    weekEnding: "2024-10-25",
    regularHours: 40,
    overtimeHours: 5,
    totalHours: 45,
    status: "pending",
  },
  {
    id: "2",
    employeeName: "Sarah Johnson",
    weekEnding: "2024-10-25",
    regularHours: 38,
    overtimeHours: 0,
    totalHours: 38,
    status: "approved",
  },
  {
    id: "3",
    employeeName: "Mike Davis",
    weekEnding: "2024-10-25",
    regularHours: 40,
    overtimeHours: 2,
    totalHours: 42,
    status: "pending",
  },
  {
    id: "4",
    employeeName: "Emily Chen",
    weekEnding: "2024-10-25",
    regularHours: 40,
    overtimeHours: 8,
    totalHours: 48,
    status: "approved",
  },
  {
    id: "5",
    employeeName: "Robert Williams",
    weekEnding: "2024-10-25",
    regularHours: 35,
    overtimeHours: 0,
    totalHours: 35,
    status: "rejected",
  },
];

function getTimesheetBadgeVariant(
  status: string
): "default" | "secondary" | "destructive" {
  if (status === "approved") {
    return "default";
  }
  if (status === "rejected") {
    return "destructive";
  }
  return "secondary";
}

export default function TimeTrackingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-semibold text-2xl">Time Tracking</h1>
        <p className="text-muted-foreground">
          Review and approve employee timesheets
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">208</div>
            <p className="text-muted-foreground text-xs">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">2</div>
            <p className="text-muted-foreground text-xs">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Approved</CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">2</div>
            <p className="text-muted-foreground text-xs">Ready for payroll</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Overtime</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">15h</div>
            <p className="text-muted-foreground text-xs">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Timesheets Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Timesheets</CardTitle>
              <CardDescription>
                Review and approve employee time entries
              </CardDescription>
            </div>
            <Button size="sm" variant="outline">
              <Filter className="mr-2 size-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Week Ending</TableHead>
                <TableHead>Regular Hours</TableHead>
                <TableHead>Overtime Hours</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timesheets.map((timesheet) => (
                <TableRow key={timesheet.id}>
                  <TableCell className="font-medium">
                    {timesheet.employeeName}
                  </TableCell>
                  <TableCell>
                    {new Date(timesheet.weekEnding).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{timesheet.regularHours}h</TableCell>
                  <TableCell>
                    {timesheet.overtimeHours > 0 ? (
                      <span className="text-orange-500">
                        {timesheet.overtimeHours}h
                      </span>
                    ) : (
                      `${timesheet.overtimeHours}h`
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {timesheet.totalHours}h
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTimesheetBadgeVariant(timesheet.status)}>
                      {timesheet.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {timesheet.status === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Check className="size-4" />
                          <span className="sr-only">Approve</span>
                        </Button>
                        <Button size="sm" variant="outline">
                          <X className="size-4" />
                          <span className="sr-only">Reject</span>
                        </Button>
                      </div>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Timesheet</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Export PDF</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
