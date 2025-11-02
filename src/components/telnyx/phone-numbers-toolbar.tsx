/**
 * Phone Numbers Toolbar
 *
 * Action bar for phone number management with:
 * - Search & purchase new numbers
 * - Port existing numbers
 * - Filter and sort options
 * - Bulk actions
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone, Upload, Search, Filter, Clock } from "lucide-react";
import Link from "next/link";
import { PhoneNumberSearchModal } from "./phone-number-search-modal";
import { NumberPortingWizard } from "./number-porting-wizard";

export function PhoneNumbersToolbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [portingOpen, setPortingOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  return (
    <>
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Search and Filters */}
          <div className="flex flex-1 items-center gap-3">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search phone numbers..."
                className="pl-9"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 size-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Numbers</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending Setup</SelectItem>
                <SelectItem value="porting">Porting</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Right: Primary Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <Link href="/dashboard/settings/communications/porting-status">
                <Clock className="mr-2 size-4" />
                Porting Status
              </Link>
            </Button>

            <Button
              variant="outline"
              onClick={() => setPortingOpen(true)}
            >
              <Upload className="mr-2 size-4" />
              Port Number
            </Button>

            <Button onClick={() => setSearchOpen(true)}>
              <Phone className="mr-2 size-4" />
              Purchase Number
            </Button>
          </div>
        </div>

        {/* Info Bar */}
        <div className="mt-3 flex items-center gap-6 text-sm text-muted-foreground">
          <div>
            <span className="font-medium text-foreground">3</span> active numbers
          </div>
          <div className="h-4 w-px bg-border" />
          <div>
            <span className="font-medium text-foreground">$3.00</span>/month total cost
          </div>
          <div className="h-4 w-px bg-border" />
          <div>
            <span className="font-medium text-foreground">1,247</span> minutes this month
          </div>
          <div className="h-4 w-px bg-border" />
          <div>
            <span className="font-medium text-foreground">423</span> SMS sent
          </div>
        </div>
      </div>

      {/* Modals */}
      <PhoneNumberSearchModal
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />

      <NumberPortingWizard
        open={portingOpen}
        onOpenChange={setPortingOpen}
      />
    </>
  );
}
