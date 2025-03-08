"use client";

import ContentManager from "@/components/cicd/ContentManager";
import EntityIndex from "@/components/cicd/EntityIndex";
import Image from "next/image";

export default function OperateHomePage() {
  const searchUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs`;
  const header = {
    label: "Operations",
    desc: "Start building and deploying your services here.",
  };

  const topic = [
    {
      title: "Available Services",
      desc: "You can start build or deploy your services in a minute! And jobs list are also available in the jobs list page",
      services: [
        {
          name: "Operate List",
          path: "/cicd/operation/operate",
          description:
            "Select services to build or deploy at your choices from project space and project.",
        },
        {
          name: "Jobs List",
          path: "/cicd/operation/jobs",
          description:
            "View your current/ previously operated job of each services base on your searching.",
        },
      ],
    },
  ];

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
      <div className="flex flex-row px-6 py-3 gap-x-12 cursor-default select-none items-center justify-between">
        <div className="flex flex-row gap-x-12 items-center">
          <Image
            src={"/images/cicd/jobs.svg"}
            alt={"disk"}
            width={32}
            height={32}
          />
          <h3 className="text-base">{entity.project.name}</h3>
        </div>
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
    <div className="min-h-screen w-full bg-ci-bg-dark-blue flex flex-col">
      <ContentManager header={header} topic={topic} />
      <div className="px-16 pb-8">
        <EntityIndex
          topic={"Recently jobs list"}
          description={
            "This is the list of recently jobs that you have run from operation page."
          }
          searchUrl={searchUrl}
          renderEntity={renderEntity}
          queryKey="previousJobs"
        />
      </div>
    </div>
  );
}
