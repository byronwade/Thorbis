"use client";

/**
 * Work > Team Members Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
  Archive,
  ArrowUpDown,
  Building2,
  Check,
  ChevronDown,
  Download,
  Filter,
  MoreVertical,
  Search,
  Shield,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type UserStatus = "active" | "invited" | "suspended";
type SortField =
  | "name"
  | "email"
  | "role"
  | "department"
  | "lastActive"
  | "joinedDate";
type SortOrder = "asc" | "desc";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  roleColor?: string;
  departmentId?: string;
  departmentName?: string;
  departmentColor?: string;
  status: UserStatus;
  avatar?: string;
  jobTitle?: string;
  phone?: string;
  joinedDate: string;
  lastActive: string;
};

type CustomRole = {
  id: string;
  name: string;
  memberCount: number;
};

type Department = {
  id: string;
  name: string;
  memberCount: number;
};

export function TeamMembersPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Mock data
  const departments: Department[] = [
    { id: "1", name: "Field Technicians", memberCount: 45 },
    { id: "2", name: "Office Staff", memberCount: 12 },
    { id: "3", name: "Management", memberCount: 5 },
    { id: "4", name: "Sales", memberCount: 8 },
  ];

  const customRoles: CustomRole[] = [
    { id: "1", name: "Owner", memberCount: 1 },
    { id: "2", name: "Administrator", memberCount: 3 },
    { id: "3", name: "Field Supervisor", memberCount: 5 },
    { id: "4", name: "Technician", memberCount: 42 },
  ];

  // Load real team members from database
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);

  useEffect(() => {
    async function loadTeamMembers() {
      setIsLoadingMembers(true);
      try {
        const { getTeamMembers } = await import("@/actions/team");
        const result = await getTeamMembers();

        if (result.success && result.data) {
          // Transform database format to component format
          const members = result.data.map((member: any) => ({
            id: member.id,
            name:
              member.user?.name ||
              member.user?.email?.split("@")[0] ||
              "Unknown",
            email: member.user?.email || "",
            roleId: member.role_id || "4",
            roleName: member.role?.name || "Team Member",
            roleColor: member.role?.color || getRoleColor(member.role?.name),
            departmentId: member.department_id || "1",
            departmentName: member.department?.name || "General",
            departmentColor:
              member.department?.color ||
              getDepartmentColor(member.department?.name),
            status: member.status || "active",
            jobTitle: member.job_title || "Team Member",
            joinedDate: member.joined_at
              ? new Date(member.joined_at).toLocaleDateString()
              : member.invited_at
                ? new Date(member.invited_at).toLocaleDateString()
                : "",
            lastActive: member.last_active_at
              ? getRelativeTime(new Date(member.last_active_at))
              : "Never",
          }));
          setTeamMembers(members);
        }
      } catch (error) {
        toast.error("Failed to load team members");
        setTeamMembers([]);
      } finally {
        setIsLoadingMembers(false);
      }
    }
    loadTeamMembers();
  }, [toast]);

  // Helper functions for colors
  function getRoleColor(roleName: string | undefined): string {
    const colors: Record<string, string> = {
      Owner: "#fbbf24",
      Administrator: "#3b82f6",
      Manager: "#10b981",
      Technician: "#6b7280",
    };
    return colors[roleName || ""] || "#6b7280";
  }

  function getDepartmentColor(deptName: string | undefined): string {
    const colors: Record<string, string> = {
      Sales: "#3b82f6",
      Operations: "#10b981",
      Service: "#f59e0b",
      Support: "#8b5cf6",
    };
    return colors[deptName || ""] || "#6b7280";
  }

  function getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60_000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }

  // Filtering
  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "all" ||
      member.departmentId === selectedDepartment;
    const matchesRole =
      selectedRole === "all" || member.roleId === selectedRole;
    const matchesStatus =
      selectedStatus === "all" || member.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
  });

  // Sorting
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    let aVal: string | undefined;
    let bVal: string | undefined;

    switch (sortField) {
      case "name":
        aVal = a.name;
        bVal = b.name;
        break;
      case "email":
        aVal = a.email;
        bVal = b.email;
        break;
      case "role":
        aVal = a.roleName;
        bVal = b.roleName;
        break;
      case "department":
        aVal = a.departmentName;
        bVal = b.departmentName;
        break;
      case "lastActive":
        aVal = a.lastActive;
        bVal = b.lastActive;
        break;
      case "joinedDate":
        aVal = a.joinedDate;
        bVal = b.joinedDate;
        break;
    }

    if (!(aVal || bVal)) {
      return 0;
    }
    if (!aVal) {
      return 1;
    }
    if (!bVal) {
      return -1;
    }

    const comparison = aVal.localeCompare(bVal);
    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedMembers.length / itemsPerPage);
  const paginatedMembers = sortedMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const getStatusBadgeVariant = (
    status: UserStatus
  ): "default" | "secondary" | "outline" => {
    switch (status) {
      case "active":
        return "default";
      case "invited":
        return "secondary";
      case "suspended":
        return "outline";
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(new Set(paginatedMembers.map((m) => m.id)));
    } else {
      setSelectedMembers(new Set());
    }
  };

  const handleSelectMember = (memberId: string, checked: boolean) => {
    const newSelected = new Set(selectedMembers);
    if (checked) {
      newSelected.add(memberId);
    } else {
      newSelected.delete(memberId);
    }
    setSelectedMembers(newSelected);
  };

  const handleBulkAction = (_action: string) => {
    setSelectedMembers(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-4xl tracking-tight">
            Team & Permissions
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your team of {teamMembers.length} members across{" "}
            {departments.length} departments
          </p>
        </div>
        <Link href="/dashboard/work/team/invite">
          <Button>
            <UserPlus className="mr-2 size-4" />
            <span className="hidden sm:inline">Invite Member</span>
            <span className="sm:hidden">Invite</span>
          </Button>
        </Link>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/work/team/roles">
          <Card className="transition-all hover:border-primary/50 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">
                    Roles & Permissions
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {customRoles.length} custom roles
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/work/team/departments">
          <Card className="transition-all hover:border-primary/50 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Departments</CardTitle>
                  <CardDescription className="text-xs">
                    {departments.length} departments
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/work/team/invite">
          <Card className="transition-all hover:border-primary/50 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <UserPlus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Invite Members</CardTitle>
                  <CardDescription className="text-xs">
                    Add new team members
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <Separator />

      {/* Team Members */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </CardTitle>
              <CardDescription>
                {filteredMembers.length} members
                {selectedMembers.size > 0 &&
                  ` • ${selectedMembers.size} selected`}
              </CardDescription>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Search */}
              <div className="relative w-64">
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search members..."
                  value={searchQuery}
                />
              </div>

              {/* Filters */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline">
                    <Filter className="mr-2 size-4" />
                    Filters
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Filter by Department</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={selectedDepartment === "all"}
                    onCheckedChange={() => setSelectedDepartment("all")}
                  >
                    All Departments
                  </DropdownMenuCheckboxItem>
                  {departments.map((dept) => (
                    <DropdownMenuCheckboxItem
                      checked={selectedDepartment === dept.id}
                      key={dept.id}
                      onCheckedChange={() => setSelectedDepartment(dept.id)}
                    >
                      {dept.name} ({dept.memberCount})
                    </DropdownMenuCheckboxItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={selectedRole === "all"}
                    onCheckedChange={() => setSelectedRole("all")}
                  >
                    All Roles
                  </DropdownMenuCheckboxItem>
                  {customRoles.map((role) => (
                    <DropdownMenuCheckboxItem
                      checked={selectedRole === role.id}
                      key={role.id}
                      onCheckedChange={() => setSelectedRole(role.id)}
                    >
                      {role.name} ({role.memberCount})
                    </DropdownMenuCheckboxItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={selectedStatus === "all"}
                    onCheckedChange={() => setSelectedStatus("all")}
                  >
                    All Statuses
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedStatus === "active"}
                    onCheckedChange={() => setSelectedStatus("active")}
                  >
                    Active
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedStatus === "invited"}
                    onCheckedChange={() => setSelectedStatus("invited")}
                  >
                    Invited
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedStatus === "suspended"}
                    onCheckedChange={() => setSelectedStatus("suspended")}
                  >
                    Suspended
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline">
                    <ArrowUpDown className="mr-2 size-4" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setSortField("name")}>
                    Name{" "}
                    {sortField === "name" && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortField("email")}>
                    Email{" "}
                    {sortField === "email" && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortField("role")}>
                    Role{" "}
                    {sortField === "role" && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortField("department")}>
                    Department{" "}
                    {sortField === "department" && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortField("lastActive")}>
                    Last Active{" "}
                    {sortField === "lastActive" && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                  >
                    {sortOrder === "asc" ? "Ascending" : "Descending"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Bulk Actions */}
              {selectedMembers.size > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="outline">
                      Bulk Actions
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleBulkAction("change_role")}
                    >
                      Change Role
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleBulkAction("change_department")}
                    >
                      Change Department
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleBulkAction("suspend")}
                    >
                      Suspend Members
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleBulkAction("export")}
                    >
                      <Download className="mr-2 size-4" />
                      Export Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleBulkAction("archive")}
                    >
                      <Archive className="mr-2 size-4" />
                      Archive Members
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Export */}
              <Button
                className="md:hidden"
                size="sm"
                title="Export"
                type="button"
                variant="outline"
              >
                <Download className="size-4" />
              </Button>
              <Button
                className="hidden md:inline-flex"
                type="button"
                variant="outline"
              >
                <Download className="mr-2 size-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Table Header */}
            <div className="flex items-center gap-4 rounded-md border bg-muted/50 p-3 font-medium text-sm">
              <Checkbox
                checked={
                  selectedMembers.size > 0 &&
                  selectedMembers.size === paginatedMembers.length
                }
                onCheckedChange={handleSelectAll}
              />
              <div className="flex-1">Name</div>
              <div className="w-32">Role</div>
              <div className="w-32">Department</div>
              <div className="w-24">Status</div>
              <div className="w-10" />
            </div>

            {/* Table Rows */}
            {paginatedMembers.map((member) => (
              <div
                className="flex items-center gap-4 rounded-md border p-3 text-sm transition-colors hover:bg-muted/50"
                key={member.id}
              >
                <Checkbox
                  checked={selectedMembers.has(member.id)}
                  onCheckedChange={(checked) =>
                    handleSelectMember(member.id, checked as boolean)
                  }
                  onClick={(e) => e.stopPropagation()}
                />
                <Link
                  className="flex min-w-0 flex-1 items-center gap-3 hover:cursor-pointer"
                  href={`/dashboard/work/team/${member.id}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-xs">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{member.name}</p>
                    <p className="truncate text-muted-foreground text-xs">
                      {member.email}
                    </p>
                  </div>
                </Link>
                <div className="w-32">
                  <Badge
                    style={{
                      backgroundColor: member.roleColor,
                      color: "white",
                    }}
                    variant="secondary"
                  >
                    {member.roleName}
                  </Badge>
                </div>
                <div className="w-32">
                  {member.departmentName && (
                    <Badge
                      style={{
                        backgroundColor: member.departmentColor,
                        color: "white",
                      }}
                      variant="outline"
                    >
                      {member.departmentName}
                    </Badge>
                  )}
                </div>
                <div className="w-24">
                  <Badge variant={getStatusBadgeVariant(member.status)}>
                    {member.status}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="h-8 w-8"
                      onClick={(e) => e.stopPropagation()}
                      size="icon"
                      type="button"
                      variant="ghost"
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/work/team/${member.id}`}>
                        View Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Change Role</DropdownMenuItem>
                    <DropdownMenuItem>Change Department</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      {member.status === "active" ? "Suspend" : "Activate"}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Archive className="mr-2 size-4" />
                      Archive Member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Show</span>
              <Select
                onValueChange={(value) => {
                  setItemsPerPage(Number.parseInt(value, 10));
                  setCurrentPage(1);
                }}
                value={itemsPerPage.toString()}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-muted-foreground">
                of {filteredMembers.length} members
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                size="sm"
                type="button"
                variant="outline"
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                size="sm"
                type="button"
                variant="outline"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

