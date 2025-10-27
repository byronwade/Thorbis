"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Filter, Plus } from "lucide-react"

export function ScheduleToolbarActions() {
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only rendering selects after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {/* Date Picker */}
      <Input
        type="date"
        className="h-8 w-[140px] border-0 bg-transparent px-2 text-xs shadow-none focus-visible:ring-1"
        onChange={(e) => console.log("Date changed:", e.target.value)}
      />

      {mounted && (
        <>
          {/* Technician Filter */}
          <Select onValueChange={(id) => console.log("Technician filter:", id)}>
            <SelectTrigger className="h-8 w-[160px] border-0 bg-transparent px-2 text-xs shadow-none focus-visible:ring-1">
              <SelectValue placeholder="All Technicians" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Technicians</SelectItem>
              <SelectItem value="john-doe">John Doe</SelectItem>
              <SelectItem value="jane-smith">Jane Smith</SelectItem>
              <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
              <SelectItem value="sarah-williams">Sarah Williams</SelectItem>
              <SelectItem value="david-brown">David Brown</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select onValueChange={(status) => console.log("Status filter:", status)}>
            <SelectTrigger className="h-8 w-[140px] border-0 bg-transparent px-2 text-xs shadow-none focus-visible:ring-1">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </>
      )}

      {/* More Filters Button */}
      <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
        <Filter className="mr-1.5 size-3.5" />
        Filters
      </Button>

      {/* Divider */}
      <div className="h-4 w-px bg-border/50" />

      {/* Action Buttons */}
      <Button size="sm" className="h-8 px-3 text-xs" onClick={() => console.log("Add job")}>
        <Plus className="mr-1.5 size-3.5" />
        New Job
      </Button>
    </>
  )
}
