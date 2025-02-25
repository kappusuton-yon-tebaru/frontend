"use client";
import EntityIndex from "@/components/cicd/EntityIndex";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

export default function ServicesListPage() {
  const router = useRouter();
  const { projectSpaceId, projectId } = useParams();
  const organizationId = "678fcf897c67bca50cfae34e";

  const searchUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${projectId}/services`;
  const operationUrl = "/operation/operate?ops=BUILD";

  const renderEntity = (entity: {
    service_name: string;
    dockerfile: string;
  }) => {
    return (
      <div
        className="flex flex-row px-6 py-3 gap-x-12 cursor-default select-none"
        onClick={() =>
          router.push(
            `/images/projectSpaces/${projectSpaceId}/projects/${projectId}/services/${entity.service_name}`
          )
        }
      >
        <Image
          src={"/images/cicd/hard-disk.svg"}
          alt={"disk"}
          width={32}
          height={32}
        />
        <h3 className="text-base w-4/5">{entity.service_name}</h3>
        <h3 className="text-base w-1/6 text-ci-modal-grey">
          26 Oct 2024, 15:00
        </h3>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-20">
      <EntityIndex
        topic={"Services List"}
        description={`This is the list of all services from project ID: ${projectId}.`}
        searchUrl={searchUrl}
        operationTopic={"Build Image"}
        operationUrl={operationUrl}
        renderEntity={renderEntity}
        queryKey="service"
      />
    </div>
  );
}
