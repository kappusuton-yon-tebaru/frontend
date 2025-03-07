"use client";
import CustomBreadcrumbs from "@/components/cicd/CustomBreadcrums";
import EntityIndex from "@/components/cicd/EntityIndex";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProjectSpaceListPage() {
  const router = useRouter();

  const organizationId = "678fcf897c67bca50cfae34e";
  const searchUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/resources/children/${organizationId}`;
  const operationUrl = "/operation/operate?ops=BUILD";

  const renderEntity = (entity: {
    id: string;
    resource_name: string;
    resource_type: string;
  }) => {
    return (
      <div
        className="flex flex-row px-6 py-3 gap-x-12 cursor-default select-none items-center"
        onClick={() =>
          router.push(`/images/projectSpaces/${entity.id}/projects`)
        }
      >
        <Image src={"/space-icon.svg"} alt={"disk"} width={32} height={32} />
        <h3 className="text-base w-4/5">{entity.resource_name}</h3>
        <h3 className="text-base w-1/6 text-ci-modal-grey">
          26 Oct 2024, 15:00
        </h3>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-20">
      <CustomBreadcrumbs />
      <EntityIndex
        topic={"Project Spaces List"}
        description={`This is the list of all project spaces from organization ID: ${organizationId}.`}
        searchUrl={searchUrl}
        operationTopic={"Build Image"}
        operationUrl={operationUrl}
        renderEntity={renderEntity}
        queryKey="projSpace"
      />
    </div>
  );
}
