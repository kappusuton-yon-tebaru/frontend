"use client";
import EntityIndex from "@/components/cicd/EntityIndex";
import Image from "next/image";
import { useRouter } from "next/navigation";

const searchUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/regproviders`;
const operationUrl = "/images/registry/create";

export default function ImagesRegistryPage() {
  const organizationId = "678fcf897c67bca50cfae34e";
  const router = useRouter();

  const renderEntity = (entity: { id: string; name: string }) => {
    return (
      <div
        className="flex flex-row px-6 py-3 gap-x-12 cursor-default select-none"
        onClick={() => router.push(`/images/registry/${entity.id}/edit`)}
      >
        <Image
          src={"/images/cicd/hard-disk.svg"}
          alt={"disk"}
          width={32}
          height={32}
        />
        <h3 className="text-base w-4/5">{entity.name}</h3>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-20">
      <EntityIndex
        topic={"Registry List"}
        description={`This is the list of all registry of organization Id: ${organizationId}.`}
        searchUrl={searchUrl}
        operationTopic={"Add Registry"}
        operationUrl={operationUrl}
        renderEntity={renderEntity}
      />
    </div>
  );
}
