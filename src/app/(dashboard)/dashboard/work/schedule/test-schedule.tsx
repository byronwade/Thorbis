"use client";

import { useSchedule } from "@/hooks/use-schedule";
import { useScheduleStore } from "@/stores/schedule-store";

/**
 * Debug component to test schedule data loading
 */
export function TestSchedule() {
  const { isLoading, error, technicians, jobs } = useSchedule();
  const rawStore = useScheduleStore();

  return (
    <div className="space-y-4 p-4">
      <div className="rounded border p-4">
        <h2 className="mb-2 font-bold text-lg">Hook State</h2>
        <div className="space-y-2 text-sm">
          <div>isLoading: {isLoading ? "true" : "false"}</div>
          <div>error: {error || "null"}</div>
          <div>technicians: {technicians.length}</div>
          <div>jobs: {jobs.length}</div>
        </div>
      </div>

      <div className="rounded border p-4">
        <h2 className="mb-2 font-bold text-lg">Raw Store State</h2>
        <div className="space-y-2 text-sm">
          <div>isLoading: {rawStore.isLoading ? "true" : "false"}</div>
          <div>error: {rawStore.error || "null"}</div>
          <div>technicians Map size: {rawStore.technicians.size}</div>
          <div>jobs Map size: {rawStore.jobs.size}</div>
        </div>
      </div>

      <div className="rounded border p-4">
        <h2 className="mb-2 font-bold text-lg">Button Actions</h2>
        <button
          className="rounded bg-red-500 px-4 py-2 text-white"
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
        >
          Clear LocalStorage & Reload
        </button>
      </div>

      {technicians.length > 0 && (
        <div className="rounded border p-4">
          <h2 className="mb-2 font-bold text-lg">First 3 Technicians</h2>
          <pre className="max-h-40 overflow-auto text-xs">
            {JSON.stringify(technicians.slice(0, 3), null, 2)}
          </pre>
        </div>
      )}

      {jobs.length > 0 && (
        <div className="rounded border p-4">
          <h2 className="mb-2 font-bold text-lg">First 3 Jobs</h2>
          <pre className="max-h-40 overflow-auto text-xs">
            {JSON.stringify(
              jobs.slice(0, 3).map((j) => ({
                id: j.id,
                title: j.title,
                technicianId: j.technicianId,
                startTime: j.startTime.toISOString(),
                endTime: j.endTime.toISOString(),
              })),
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
}
