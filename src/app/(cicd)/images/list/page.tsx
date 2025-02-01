"use client";
import EntityIndex from "@/components/cicd/EntityIndex";
import Image from "next/image";

const searchUrl = "http://localhost:3001/users";

export default function ImagesListPage() {
  const renderEntity = (entity: { id: string; name: string }) => {
    return (
      <div className="flex flex-row bg-ci-modal-black px-6 py-3 border-y border-x border-ci-modal-grey gap-x-12">
        <Image
          src={"/images/cicd/hard-disk.svg"}
          alt={"disk"}
          width={32}
          height={32}
        />
        <h3 className="text-base w-4/5">{entity.name}</h3>
        <h3 className="text-base w-1/6 text-ci-modal-grey">
          26 Oct 2024, 15:00
        </h3>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-24">
      <EntityIndex
        topic={"Services List"}
        searchUrl={searchUrl}
        renderEntity={renderEntity}
      />
    </div>
  );
}
