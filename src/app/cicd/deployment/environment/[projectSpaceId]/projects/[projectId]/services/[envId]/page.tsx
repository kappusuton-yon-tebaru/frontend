"use client";
import EntityIndex from "@/components/cicd/EntityIndex";
import { SelectorOption } from "@/components/cicd/Selector";
import formatDate from "@/hooks/cicd";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

const sortBy: SelectorOption[] = [
  { label: "Service Name", id: "service_name" },
  { label: "status", id: "status" },
  { label: "Age", id: "age" },
];

export default function DeployedServiceListPage() {
  const router = useRouter();
  const { projectSpaceId, projectId, envId } = useParams();

  // const searchUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs`;
  const searchUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${projectId}/deploy?deployment_env=${envId}&`;
  const operationUrl = "/cicd/operation/operate?ops=DEPLOY";

  const renderEntity = (entity: {
    project_id: string;
    deployment_env: string;
    deployment_status: string;
    age: string;
    project_name: string;
    service_name: string;
  }) => {
    return (
      <div
        className="flex flex-row px-6 py-3 gap-x-12 cursor-default select-none items-center justify-between"
        onClick={() =>
          router.push(
            `/cicd/deployment/environment/${projectSpaceId}/projects/${projectId}/services/${entity.deployment_env}/${entity.service_name}`
          )
        }
      >
        <div className="flex flex-row gap-x-12 items-center">
          <Image
            src={"/images/cicd/server.svg"}
            alt={"disk"}
            width={32}
            height={32}
          />
          <div className="flex flex-col justify-center">
            <h3 className="text-lg">{entity.service_name}</h3>
            <div className="text-sm text-ci-modal-grey">
              {entity.project_name}
            </div>
            <div className="text-sm text-ci-modal-grey">
              Deployment environment: {entity.deployment_env}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-1/6">
          <h3 className="text-base text-ci-modal-grey">Service URL: </h3>
          <a href="www.test.com" className="text-ci-modal-light-blue underline">
            www.test.com
          </a>
        </div>
        <div className="text-base text-ci-modal-grey w-1/6">
          Age: {entity.age}
        </div>
        <div className="flex flex-row gap-x-12 items-center px-8 justify-around w-1/5">
          <Image
            src={`/images/cicd/${entity.deployment_status}.svg`}
            alt={"disk"}
            width={20}
            height={20}
          />
          <h3 className="text-base w-1/2 text-ci-modal-grey">
            {entity.deployment_status}
          </h3>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-8">
      <EntityIndex
        topic={"Deployed Services List"}
        description={`This is the list of all services of environment ${envId} that you have deployed from operation page.`}
        operationTopic={"Deploy"}
        operationUrl={operationUrl}
        searchUrl={searchUrl}
        renderEntity={renderEntity}
        queryKey="deployments"
        sortByOptions={sortBy}
      />
    </div>
  );
}
