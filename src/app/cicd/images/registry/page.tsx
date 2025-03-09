"use client";
import EntityIndex from "@/components/cicd/EntityIndex";
import { SelectorOption } from "@/components/cicd/Selector";
import formatDate from "@/hooks/cicd";
import Image from "next/image";
import { useRouter } from "next/navigation";

const searchUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/regproviders`;
const operationUrl = "/cicd/images/registry/create";

const sortBy: SelectorOption[] = [
  { label: "Registry Name", id: "name" },
  { label: "Created At", id: "created_at" },
];

export default function ImagesRegistryPage() {
  const organizationId = "678fcf897c67bca50cfae34e";
  const router = useRouter();

  const renderEntity = (entity: {
    id: string;
    name: string;
    provider_type: string;
    created_at: string;
    updated_at: string;
  }) => {
    return (
      <div
        className="flex flex-row px-6 py-3 gap-x-12 cursor-default select-none justify-between items-center"
        onClick={() => router.push(`/cicd/images/registry/${entity.id}/edit`)}
      >
        <Image
          src={"/images/cicd/hard-disk.svg"}
          alt={"disk"}
          width={32}
          height={32}
        />
        <h3 className="text-base w-1/3">{entity.name}</h3>
        <h3 className="text-base w-1/4 text-ci-modal-grey">
          Provider: {entity.provider_type}
        </h3>
        <h3 className="text-base w-1/4 text-ci-modal-grey">
          Created at: {formatDate(entity.created_at)}
        </h3>
        <h3 className="text-base w-1/4 text-ci-modal-grey">
          Updated at: {formatDate(entity.updated_at)}
        </h3>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-8">
      <EntityIndex
        topic={"Registry List"}
        description={`This is the list of all registry of organization Id: ${organizationId}.`}
        searchUrl={searchUrl}
        operationTopic={"Add Registry"}
        operationUrl={operationUrl}
        renderEntity={renderEntity}
        sortByOptions={sortBy}
      />
    </div>
  );
}
