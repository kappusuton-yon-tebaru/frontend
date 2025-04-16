"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { Resource } from "@/interfaces/workspace";
import ProjectSpaceButton from "@/components/ProjectSpaceButton";
import { useResource, useProjectSpaces } from "@/hooks/workspace";
import { Pagination, Spin, Button } from "antd";
import Image from "next/image";
import SortManager from "@/components/SortManager";

export default function Organization() {
  const router = useRouter();
  const { orgId } = useParams();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState<string>("resource_name");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  if (typeof orgId === "undefined" || Array.isArray(orgId)) {
    throw new Error("Invalid orgId");
  }

  const { data: organization } = useResource(orgId);
  const { data: projectSpaces, isLoading } = useProjectSpaces(
    orgId,
    page,
    sorting,
    sortOrder,
    searchTerm
  );

  return (
    <div>
      <div className="flex flex-col">
        <div className="flex justify-between mb-4">
          <div className="flex flex-col">
            <h1 className="font-bold text-[24px]">
              {organization?.resource_name}
            </h1>
            <h2 className="font-medium text-[16px] text-ci-modal-grey">
              Owner: user 1
            </h2>
          </div>
          <div className="flex gap-8 my-2">
            <Button
              className="h-10 w-60 text-[18px] border border-ci-modal-grey px-6 py-1 bg-ci-modal-black rounded-md font-semibold hover:bg-ci-modal-blue transition-all duration-300 ease-in-out"
              onClick={() => router.push(`/organization/${orgId}/manage`)}
            >
              Manage Organization
            </Button>
            <Button
              className="h-10 w-60 text-[18px] border border-ci-modal-grey px-6 py-1 bg-ci-modal-black rounded-md font-semibold hover:bg-ci-modal-blue transition-all duration-300 ease-in-out"
              onClick={() =>
                router.push(`/organization/${orgId}/new-project-space`)
              }
            >
              New Project Space
            </Button>
          </div>
        </div>
        <div className="flex flex-row items-center gap-8 w-full h-10">
          <div className="flex items-center border p-2 rounded-md border-ci-modal-grey bg-ci-modal-black flex-grow h-full">
            <Image
              src="/search-icon.svg"
              alt="search-icon"
              width={20}
              height={20}
              className="mr-2"
            />
            <input
              type="text"
              placeholder="Find a project space..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              className="flex-grow bg-transparent text-white outline-none h-full"
            />
          </div>
          <SortManager
            sorting={sorting}
            setSorting={setSorting}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        </div>
      </div>

      <hr className="my-6 mx-[-20px] border-ci-modal-grey"></hr>
      {projectSpaces && !isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {projectSpaces?.data.map((space: Resource, index: number) => (
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
          total={projectSpaces?.total}
          pageSize={pageSize}
          onChange={setPage}
        />
      </div>
    </div>
  );
}
