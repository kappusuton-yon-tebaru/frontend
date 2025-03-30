"use client";

import LogsTemplate from "@/components/cicd/LogsTemplate";
import { useParams } from "next/navigation";

export default function DeploymentLogsPage() {
  const { projectSpaceId, projectId, envId, serviceId } = useParams();
  return (
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-8">
      <LogsTemplate
        topic={`${serviceId} logs`}
        description={`This is logs of ${serviceId}`}
        logsUrl="test"
      />
    </div>
  );
}
