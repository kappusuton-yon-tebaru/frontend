"use client";
import EntityIndex from "@/components/cicd/EntityIndex";
import { SelectorOption } from "@/components/cicd/Selector";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

const sortBy: SelectorOption[] = [
  { label: "Project Name", id: "project.name" },
  { label: "Servcie Name", id: "servcie_name" },
  { label: "Job Status", id: "job_status" },
  { label: "Created At", id: "created_at" },
];

export default function SubJobsListPage() {
  const router = useRouter();
  const { jobId } = useParams();
  const searchUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/${jobId}`;

  const renderEntity = (entity: {
    id: string;
    job_type: string;
    job_status: string;
    service_name: string;
    created_at: string;
    project: {
      id: string;
      name: string;
    };
  }) => {
    return (
      <div className="flex flex-row px-6 py-3 gap-x-12 cursor-default select-none items-center justify-between">
        <div className="flex flex-row gap-x-12 items-center">
          <Image
            src={"/images/cicd/jobs.svg"}
            alt={"disk"}
            width={32}
            height={32}
          />
          <h3 className="text-base w-full">{entity.service_name}</h3>
        </div>
        <h3 className="text-base text-ci-modal-grey">
          Job type: {entity.job_type}
        </h3>
        <h3 className="text-base text-ci-modal-grey">
          Created at: {entity.created_at}
        </h3>
        <div className="flex flex-row gap-x-12 items-center px-8 justify-around w-1/5">
          <Image
            src={`/images/cicd/${entity.job_status}.svg`}
            alt={"disk"}
            width={20}
            height={20}
          />
          <h3 className="text-base w-1/2 text-ci-modal-grey">
            {entity.job_status}
          </h3>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-8">
      <EntityIndex
        topic={"Sub Jobs List"}
        description={`This is the list of all sub-jobs from job ID: ${jobId}.`}
        searchUrl={searchUrl}
        renderEntity={renderEntity}
        sortByOptions={sortBy}
        queryKey="subJobs"
      />
    </div>
  );
}
