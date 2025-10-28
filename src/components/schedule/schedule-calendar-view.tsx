/**
 * Schedule Calendar View - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Static calendar grid rendered on server
 * - Reduced JavaScript bundle size
 * - Better initial page load performance
 */

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const HOURS = Array.from({ length: 13 }, (_, i) => i + 7) // 7 AM to 7 PM

export function ScheduleCalendarView() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Calendar Header */}
      <div className="border-b bg-muted/30 p-4">
        <h2 className="font-semibold text-lg">Week of January 20, 2025</h2>
      </div>

      {/* Calendar Grid */}
      <div className="flex flex-1 overflow-auto">
        {/* Time column */}
        <div className="w-16 shrink-0 border-r">
          <div className="h-12 border-b" /> {/* Header spacer */}
          {HOURS.map((hour) => (
            <div key={hour} className="flex h-20 items-start justify-end border-b pr-2 pt-1 text-muted-foreground text-xs">
              {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="flex flex-1">
          {DAYS.map((day, index) => (
            <div key={day} className="flex flex-1 flex-col border-r last:border-r-0">
              {/* Day header */}
              <div className="flex h-12 shrink-0 flex-col items-center justify-center border-b bg-muted/20">
                <div className="text-muted-foreground text-xs">{day}</div>
                <div className={cn(
                  "flex size-6 items-center justify-center rounded-full text-sm",
                  index === 3 && "bg-primary text-primary-foreground" // Highlight today (Wed)
                )}>
                  {20 + index}
                </div>
              </div>

              {/* Time slots */}
              <div className="flex-1">
                {HOURS.map((hour) => (
                  <div key={hour} className="relative h-20 border-b">
                    {/* Sample events for demo */}
                    {index === 3 && hour === 9 && (
                      <div className="absolute inset-x-1 top-1 bottom-auto rounded bg-blue-500/20 p-1 text-xs border-l-2 border-blue-500">
                        <div className="font-semibold truncate">System Inspection</div>
                        <div className="text-muted-foreground text-[10px] truncate">9:00 - 11:00</div>
                      </div>
                    )}
                    {index === 3 && hour === 14 && (
                      <div className="absolute inset-x-1 top-1 bottom-auto rounded bg-yellow-500/20 p-1 text-xs border-l-2 border-yellow-500">
                        <div className="font-semibold truncate">Emergency Repair</div>
                        <div className="text-muted-foreground text-[10px] truncate">2:00 - 4:00</div>
                      </div>
                    )}
                    {index === 1 && hour === 10 && (
                      <div className="absolute inset-x-1 top-1 bottom-auto rounded bg-green-500/20 p-1 text-xs border-l-2 border-green-500">
                        <div className="font-semibold truncate">Maintenance</div>
                        <div className="text-muted-foreground text-[10px] truncate">10:00 - 12:00</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
