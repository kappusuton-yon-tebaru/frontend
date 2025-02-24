"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { Resource } from "@/interfaces/workspace";
import ProjectSpaceButton from "@/components/ProjectSpaceButton";
import { useOrganization, useProjectSpaces } from "@/hooks/workspace";
import { Pagination, Spin, Button } from "antd";

export default function Organization() {
  const router = useRouter();
  const { orgId } = useParams();
  const [page, setPage] = useState(1);
  const pageSize = 2;

  if (typeof orgId === "undefined" || Array.isArray(orgId)) {
    throw new Error("Invalid orgId");
  }

  const { data: organization } = useOrganization(orgId);
  const { data: projectSpaces, isLoading } = useProjectSpaces(orgId, page);

  return (
    <div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <h1 className="font-bold text-[24px]">
            {organization.resource_name}
          </h1>
          <h2 className="font-medium text-[16px] text-ci-modal-grey">
            Owner: user 1
          </h2>
        </div>
        <div className="flex gap-8 my-2">
          <button
            className="border border-ci-modal-grey px-6 py-1 bg-ci-modal-black rounded-md font-bold hover:bg-ci-modal-blue transition-all duration-300 ease-in-out"
            onClick={() => router.push(`/organization/${orgId}/manage`)}
          >
            Manage Organization
          </button>
          <button
            className="border border-ci-modal-grey px-6 py-1 bg-ci-modal-black rounded-md font-bold hover:bg-ci-modal-blue transition-all duration-300 ease-in-out"
            onClick={() =>
              router.push(`/organization/${orgId}/new-project-space`)
            }
          >
            New Project Space
          </button>
        </div>
      </div>
      <hr className="my-6 mx-[-20px] border-ci-modal-grey"></hr>
      {projectSpaces.data.length > 0 && !isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {projectSpaces.data.map((space: Resource, index: number) => (
            <div
              key={index}
              onClick={() =>
                router.push(`/organization/${orgId}/project-space/${space.id}`)
              }
              className="cursor-pointer"
            >
              <ProjectSpaceButton projectSpace={space} />
            </div>
          ))}
        </div>
      ) : (
        <Spin />
      )}
      <div className="mt-4 flex justify-center w-full">
        <Pagination
          current={page}
          total={projectSpaces.total}
          pageSize={pageSize}
          onChange={setPage}
        />
      </div>
    </div>
  );
}
