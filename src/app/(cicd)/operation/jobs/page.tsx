"use client";
import EntityIndex from "@/components/cicd/EntityIndex";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function JobsListPage() {
  const router = useRouter();
  const searchUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs`;

  const renderEntity = (entity: {
    id: string;
    job_status: string;
    created_at: string;
  }) => {
    return (
      <div
        className="flex flex-row px-6 py-3 gap-x-12 cursor-default select-none"
        onClick={() => router.push(`/operation/jobs/${entity.id}`)}
      >
        <Image
          src={"/images/cicd/hard-disk.svg"}
          alt={"disk"}
          width={32}
          height={32}
        />
        <h3 className="text-base w-4/5">{entity.id}</h3>
        <h3 className="text-base w-1/6 text-ci-modal-grey">
          Status: {entity.job_status}
        </h3>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-20">
      <EntityIndex
        topic={"Jobs List"}
        searchUrl={searchUrl}
        renderEntity={renderEntity}
      />
    </div>
  );
}
