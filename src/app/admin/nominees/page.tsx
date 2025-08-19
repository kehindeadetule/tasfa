import SubmissionsGrid from "@/components/SubmissionsGrid";
import QueueStatusMonitor from "@/components/QueueStatusMonitor";

export default function AdminSubmissionsPage() {
  return (
    <div className="space-y-6">
      <QueueStatusMonitor />
      <SubmissionsGrid />
    </div>
  );
}
