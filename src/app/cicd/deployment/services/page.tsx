"use client";
import EntityIndex from "@/components/cicd/EntityIndex";
import { SelectorOption } from "@/components/cicd/Selector";
import formatDate from "@/hooks/cicd";
import Image from "next/image";
import { useRouter } from "next/navigation";

const sortBy: SelectorOption[] = [
  { label: "Project Name", id: "project.name" },
  // { label: "status", id: "status" },
  { label: "Created At", id: "created_at" },
];

export default function DeployedServiceListPage() {
  const router = useRouter();
  const searchUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs`;
  const operationUrl = "/cicd/operation/operate?ops=DEPLOY";

  const renderEntity = (entity: {
    id: string;
    job_status: string;
    created_at: string;
    project: {
      id: string;
      name: string;
    };
  }) => {
    return (
      <div
        className="flex flex-row px-6 py-3 gap-x-12 cursor-default select-none items-center justify-between"
        onClick={() => router.push(`/cicd/deployment/services/${entity.id}`)}
      >
        <div className="flex flex-row gap-x-12 items-center">
          <Image
            src={"/images/cicd/server.svg"}
            alt={"disk"}
            width={32}
            height={32}
          />
          <div className="flex flex-col justify-center">
            <h3 className="text-lg">service1</h3>
            <div className="text-sm text-ci-modal-grey">test project</div>
            <div className="text-sm text-ci-modal-grey">
              Deployment environment: staging
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h3 className="text-base text-ci-modal-grey">Service URL: </h3>
          <a href="www.test.com" className="text-ci-modal-light-blue underline">
            www.test.com
          </a>
        </div>
        <div className="text-base text-ci-modal-grey">Age: 24 day</div>
        <div className="flex flex-row gap-x-12 items-center px-8 justify-around w-1/5">
          <Image
            src={`/images/cicd/${entity.job_status}.svg`}
            alt={"disk"}
            width={20}
            height={20}
          />
          <h3 className="text-base w-1/2 text-ci-modal-grey">healthy</h3>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-8">
      <EntityIndex
        topic={"Deployed Services List"}
        description={
          "This is the list of all services that you have deployed from operation page."
        }
        operationTopic={"Deploy"}
        operationUrl={operationUrl}
        searchUrl={searchUrl}
        renderEntity={renderEntity}
        queryKey="jobs"
        sortByOptions={sortBy}
      />
    </div>
  );
}
