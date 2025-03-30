"use client";

import LogsTemplate from "@/components/cicd/LogsTemplate";
import { useParams } from "next/navigation";

export default function JobLogsPage() {
  const { jobId } = useParams();
  return (
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-8">
      <LogsTemplate
        topic={`Job ${jobId} logs`}
        description={`This is logs of job ${jobId}`}
        logsUrl="test"
      />
    </div>
  );
}
