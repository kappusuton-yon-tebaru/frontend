"use client";
import EntityIndex from "@/components/cicd/EntityIndex";
import { SelectorOption } from "@/components/cicd/Selector";
import Image from "next/image";
import { useParams } from "next/navigation";

const sortBy: SelectorOption[] = [
  { label: "Service Name", id: "name" },
  { label: "Created At", id: "created_at" },
];

export default function ImagesListPage() {
  const { projectSpaceId, projectId, serviceId } = useParams();
  const searchUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/ecr/images?project_id=${projectId}&service_name=${serviceId}&`;

  const renderEntity = (entity: {
    id: string;
    image_tag: string;
    created_at: string;
  }) => {
    return (
      <div className="flex flex-row px-6 py-3 gap-x-12 cursor-default select-none items-center">
        <Image
          src={"/images/cicd/hard-disk.svg"}
          alt={"disk"}
          width={32}
          height={32}
        />
        <h3 className="text-base w-4/5">{entity.image_tag}</h3>
        <h3 className="text-base w-1/6 text-ci-modal-grey">
          {entity.created_at}
        </h3>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-4">
      <EntityIndex
        topic={"Images List"}
        description={`This is the list of all images of ${serviceId}.`}
        searchUrl={searchUrl}
        operationTopic={"Build Image"}
        operationUrl={"/operation/operate?ops=build"}
        renderEntity={renderEntity}
        queryKey={serviceId}
        // sortByOptions={sortBy}
      />
    </div>
  );
}
