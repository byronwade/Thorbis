"use client";

/**
 * Job Detail Toolbar Wrapper - Client Component
 *
 * Fetches job data and passes to JobDetailToolbar
 * This allows the layout config to remain static while getting dynamic data
 */

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { JobDetailToolbar } from "./job-detail-toolbar";

export function JobDetailToolbarWrapper() {
  const params = useParams();
  const jobId = params?.id as string;
  const [jobData, setJobData] = useState<any>(null);

  useEffect(() => {
    // Fetch job data when component mounts
    async function fetchJobData() {
      try {
        const response = await fetch(`/api/jobs/${jobId}/toolbar-data`);
        if (response.ok) {
          const data = await response.json();
          setJobData(data);
        }
      } catch (error) {
        console.error("Failed to fetch job data for toolbar:", error);
      }
    }

    if (jobId) {
      fetchJobData();
    }
  }, [jobId]);

  return (
    <JobDetailToolbar
      customer={jobData?.customer}
      invoices={jobData?.invoices || []}
      job={jobData?.job}
      jobMaterials={jobData?.jobMaterials || []}
      metrics={jobData?.metrics}
      payments={jobData?.payments || []}
      teamAssignments={jobData?.teamAssignments || []}
      timeEntries={jobData?.timeEntries || []}
    />
  );
}
