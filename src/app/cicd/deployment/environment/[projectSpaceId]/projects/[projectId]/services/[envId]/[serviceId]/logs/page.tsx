"use client";

import LogsTemplate from "@/components/cicd/LogsTemplate";
import { useParams } from "next/navigation";

export default function DeploymentLogsPage() {
  const { projectSpaceId, projectId, envId, serviceId } = useParams();
  const logUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${projectId}/deploy/log?service_name=${serviceId}&deploy_env=${envId}`;

  return (
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-8">
      <LogsTemplate
        topic={`${serviceId} logs`}
        description={`This is logs of ${serviceId}`}
        logsUrl={logUrl}
      />
    </div>
  );
}
