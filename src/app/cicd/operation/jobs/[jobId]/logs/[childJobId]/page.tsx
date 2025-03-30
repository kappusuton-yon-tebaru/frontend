"use client";

import LogsTemplate from "@/components/cicd/LogsTemplate";
import { useParams } from "next/navigation";

export default function JobLogsPage() {
  const { jobId, childJobId } = useParams();
  const logUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/${childJobId}/log?`;
  const jobStatus = `${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/${childJobId}`;

  return (
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-8">
      <LogsTemplate
        topic={`Job's logs`}
        description={`This is logs of job ${childJobId}`}
        logsUrl={logUrl}
        statusCheckUrl={jobStatus}
      />
    </div>
  );
}
