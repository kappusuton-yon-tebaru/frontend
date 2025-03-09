"use client";
import EntityIndex from "@/components/cicd/EntityIndex";
import { SelectorOption } from "@/components/cicd/Selector";
import formatDate from "@/hooks/cicd";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

const sortBy: SelectorOption[] = [
  { label: "Project Name", id: "resource_name" },
  { label: "Created At", id: "created_at" },
];

export default function ProjectsListPage() {
  const router = useRouter();
  const { projectSpaceId } = useParams();

  const searchUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/resources/children/${projectSpaceId}`;
  const operationUrl = "/cicd/operation/operate?ops=BUILD";

  const renderEntity = (entity: {
    id: string;
    resource_name: string;
    resource_type: string;
    created_at: string;
    updated_at: string;
  }) => {
    return (
      <div
        className="flex flex-row px-6 py-3 gap-x-12 cursor-default select-none items-center justify-between"
        onClick={() =>
          router.push(
            `/cicd/images/projectSpaces/${projectSpaceId}/projects/${entity.id}/services`
          )
        }
      >
        <Image src={"/repo-icon.svg"} alt={"disk"} width={32} height={32} />
        <h3 className="text-base w-4/6">{entity.resource_name}</h3>
        <h3 className="text-base w-1/3 text-ci-modal-grey">
          Created at: {formatDate(entity.created_at)}
        </h3>
        <h3 className="text-base w-1/3 text-ci-modal-grey">
          Updated at: {formatDate(entity.updated_at)}
        </h3>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-4">
      <EntityIndex
        topic={"Projects List"}
        searchUrl={searchUrl}
        description={`This is the list of all projects from project space ID: ${projectSpaceId}.`}
        operationTopic={"Build Image"}
        operationUrl={operationUrl}
        renderEntity={renderEntity}
        queryKey="proj"
        sortByOptions={sortBy}
      />
    </div>
  );
}
