"use client";

import { AlertCircle, Camera, CheckCircle, Plus, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { addEquipmentToJob } from "@/actions/equipment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface EquipmentServicedSectionProps {
  jobId: string;
  jobEquipment: any[];
  customerEquipment: any[];
}

export function EquipmentServicedSection({
  jobId,
  jobEquipment,
  customerEquipment,
}: EquipmentServicedSectionProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddEquipment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await addEquipmentToJob(formData);

    if (result.success) {
      toast.success("Equipment added to job");
      setIsAddDialogOpen(false);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to add equipment");
    }

    setIsLoading(false);
  };

  const getConditionBadge = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case "excellent":
        return (
          <Badge className="bg-green-600" variant="default">
            Excellent
          </Badge>
        );
      case "good":
        return (
          <Badge className="bg-blue-600" variant="default">
            Good
          </Badge>
        );
      case "fair":
        return <Badge variant="secondary">Fair</Badge>;
      case "poor":
        return <Badge variant="destructive">Poor</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{condition || "Unknown"}</Badge>;
    }
  };

  const getServiceTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      installation: "bg-purple-600",
      repair: "bg-orange-600",
      maintenance: "bg-blue-600",
      inspection: "bg-green-600",
      replacement: "bg-red-600",
    };

    return (
      <Badge className={colors[type] || "bg-gray-600"} variant="default">
        {type?.charAt(0).toUpperCase() + type?.slice(1)}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            <CardTitle>Equipment Serviced</CardTitle>
            <Badge variant="outline">{jobEquipment.length}</Badge>
          </div>
          <Dialog onOpenChange={setIsAddDialogOpen} open={isAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Equipment to Job</DialogTitle>
                <DialogDescription>
                  Select customer equipment that was serviced on this job
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleAddEquipment}>
                <input name="job_id" type="hidden" value={jobId} />

                <div>
                  <Label htmlFor="equipment_id">Equipment</Label>
                  <Select name="equipment_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      {customerEquipment.map((eq: any) => (
                        <SelectItem key={eq.id} value={eq.id}>
                          {eq.name} - {eq.manufacturer} {eq.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="service_type">Service Type</Label>
                  <Select defaultValue="maintenance" name="service_type">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="installation">Installation</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="replacement">Replacement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="condition_before">Condition Before</Label>
                    <Select name="condition_before">
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="condition_after">Condition After</Label>
                    <Select name="condition_after">
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="work_performed">Work Performed</Label>
                  <Textarea
                    id="work_performed"
                    name="work_performed"
                    placeholder="Describe the work performed on this equipment..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="technician_notes">Technician Notes</Label>
                  <Textarea
                    id="technician_notes"
                    name="technician_notes"
                    placeholder="Internal notes about this service..."
                    rows={2}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => setIsAddDialogOpen(false)}
                    type="button"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button disabled={isLoading} type="submit">
                    {isLoading ? "Adding..." : "Add Equipment"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {jobEquipment.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Wrench className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-4 text-muted-foreground text-sm">
              No equipment added to this job yet
            </p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              size="sm"
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add First Equipment
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobEquipment.map((je: any) => (
              <div
                className="space-y-3 rounded-lg border p-4 transition-colors hover:bg-accent/50"
                key={je.id}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h4 className="font-semibold">{je.equipment?.name}</h4>
                      {getServiceTypeBadge(je.service_type)}
                    </div>
                    <div className="space-y-1 text-muted-foreground text-sm">
                      <p>
                        {je.equipment?.manufacturer} {je.equipment?.model}
                        {je.equipment?.serial_number &&
                          ` • SN: ${je.equipment.serial_number}`}
                      </p>
                    </div>
                  </div>
                </div>

                {je.work_performed && (
                  <div className="text-sm">
                    <span className="font-medium">Work Performed:</span>
                    <p className="mt-1 text-muted-foreground">
                      {je.work_performed}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  {je.condition_before && (
                    <div>
                      <span className="mr-2 text-muted-foreground">
                        Before:
                      </span>
                      {getConditionBadge(je.condition_before)}
                    </div>
                  )}
                  {je.condition_after && (
                    <div>
                      <span className="mr-2 text-muted-foreground">After:</span>
                      {getConditionBadge(je.condition_after)}
                    </div>
                  )}
                  {je.follow_up_needed && (
                    <Badge variant="destructive">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Follow-up Needed
                    </Badge>
                  )}
                  {je.warranty_work && (
                    <Badge variant="secondary">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Warranty Work
                    </Badge>
                  )}
                </div>

                {je.technician_notes && (
                  <div className="rounded bg-muted/50 p-3 text-sm">
                    <span className="font-medium">Tech Notes:</span>
                    <p className="mt-1 text-muted-foreground">
                      {je.technician_notes}
                    </p>
                  </div>
                )}

                {(je.before_photos?.length > 0 ||
                  je.after_photos?.length > 0) && (
                  <div className="flex items-center gap-4 border-t pt-2">
                    {je.before_photos?.length > 0 && (
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <Camera className="h-4 w-4" />
                        <span>{je.before_photos.length} before</span>
                      </div>
                    )}
                    {je.after_photos?.length > 0 && (
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <Camera className="h-4 w-4" />
                        <span>{je.after_photos.length} after</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
