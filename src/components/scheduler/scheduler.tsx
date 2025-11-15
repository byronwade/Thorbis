"use client";

import { addDays, format, startOfDay } from "date-fns";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Package,
} from "lucide-react";
import * as React from "react";
import Legend from "./components/scheduler/legend";
import type {
  Assignment,
  JobCategory,
  TeamMember,
} from "./components/scheduler/types";
import BoardView from "./components/scheduler/view-board";
import ListView from "./components/scheduler/view-list";
import OrdersView from "./components/scheduler/view-orders";
import { Button } from "./components/ui/button";
import { Calendar as CalendarPicker } from "./components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

type ViewMode = "board" | "list" | "orders";

// Mock data for demonstration
const mockMembers: TeamMember[] = [
  {
    id: "1",
    name: "John Smith",
    avatar: "/placeholder-user.jpg",
    role: "Technician",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    avatar: "/placeholder-user.jpg",
    role: "Technician",
  },
  {
    id: "3",
    name: "Mike Davis",
    avatar: "/placeholder-user.jpg",
    role: "Technician",
  },
];

const mockCategories: JobCategory[] = [
  { id: "install", name: "Installation", color: "#3b82f6" },
  { id: "repair", name: "Repair", color: "#f59e0b" },
  { id: "maintenance", name: "Maintenance", color: "#10b981" },
];

const mockAssignments: Assignment[] = [
  {
    id: "1",
    title: "HVAC Installation",
    start: new Date().toISOString(),
    end: addDays(new Date(), 0).toISOString(),
    memberId: "1",
    categoryId: "install",
    customer: "ABC Corp",
  },
  {
    id: "2",
    title: "AC Repair",
    start: addDays(new Date(), 1).toISOString(),
    end: addDays(new Date(), 1).toISOString(),
    memberId: "2",
    categoryId: "repair",
    customer: "XYZ Inc",
  },
];

export default function Scheduler() {
  const [viewMode, setViewMode] = React.useState<ViewMode>("board");
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [daysToShow, setDaysToShow] = React.useState(7);

  const handlePrevious = () => {
    setCurrentDate((prev) => addDays(startOfDay(prev), -daysToShow));
  };

  const handleNext = () => {
    setCurrentDate((prev) => addDays(startOfDay(prev), daysToShow));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="flex h-screen flex-col bg-neutral-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-3">
        <div className="flex items-center gap-4">
          <h1 className="font-semibold text-lg">Scheduler</h1>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 rounded-lg border p-1">
            <Button
              onClick={() => setViewMode("board")}
              size="sm"
              variant={viewMode === "board" ? "default" : "ghost"}
            >
              <LayoutGrid className="mr-2 size-4" />
              Board
            </Button>
            <Button
              onClick={() => setViewMode("list")}
              size="sm"
              variant={viewMode === "list" ? "default" : "ghost"}
            >
              <List className="mr-2 size-4" />
              List
            </Button>
            <Button
              onClick={() => setViewMode("orders")}
              size="sm"
              variant={viewMode === "orders" ? "default" : "ghost"}
            >
              <Package className="mr-2 size-4" />
              Orders
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Date Range Selector */}
          <Select
            onValueChange={(value) => setDaysToShow(Number.parseInt(value))}
            value={daysToShow.toString()}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Day</SelectItem>
              <SelectItem value="3">3 Days</SelectItem>
              <SelectItem value="7">7 Days</SelectItem>
              <SelectItem value="14">14 Days</SelectItem>
              <SelectItem value="30">30 Days</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Navigation */}
          <div className="flex items-center gap-2">
            <Button onClick={handlePrevious} size="sm" variant="outline">
              <ChevronLeft className="size-4" />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button className="w-[200px]" size="sm" variant="outline">
                  <Calendar className="mr-2 size-4" />
                  {format(currentDate, "MMM d, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <CalendarPicker
                  initialFocus
                  mode="single"
                  onSelect={(date) => date && setCurrentDate(date)}
                  selected={currentDate}
                />
              </PopoverContent>
            </Popover>

            <Button onClick={handleNext} size="sm" variant="outline">
              <ChevronRight className="size-4" />
            </Button>

            <Button onClick={handleToday} size="sm">
              Today
            </Button>
          </div>

          <Legend categories={mockCategories} />
        </div>
      </div>

      {/* View Content */}
      {viewMode === "board" && (
        <BoardView
          assignments={mockAssignments}
          categories={mockCategories}
          date={currentDate}
          days={daysToShow}
          members={mockMembers}
        />
      )}
      {viewMode === "list" && (
        <ListView
          assignments={mockAssignments}
          categories={mockCategories}
          date={currentDate}
          days={daysToShow}
          members={mockMembers}
        />
      )}
      {viewMode === "orders" && (
        <OrdersView
          assignments={mockAssignments}
          categories={mockCategories}
          date={currentDate}
          days={daysToShow}
          members={mockMembers}
        />
      )}
    </div>
  );
}
