"use client";

import RenamePopup from "@/components/RenamePopup";
import RepositoryButton from "@/components/RepositoryButton";
import SortManager from "@/components/SortManager";
import { useResource, useRepositories } from "@/hooks/workspace";
import { Resource } from "@/interfaces/workspace";
import { Pagination, Spin, Button } from "antd";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function ProjectSpace() {
  const router = useRouter();
  const { orgId, projSpaceId } = useParams();

  if (typeof orgId === "undefined" || Array.isArray(orgId)) {
    throw new Error("Invalid orgId");
  }

  if (typeof projSpaceId === "undefined" || Array.isArray(projSpaceId)) {
    throw new Error("Invalid projSpaceId");
  }

  const [page, setPage] = useState(1);
  const pageSize = 4;
  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState<string>("resource_name");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  const { data: organization } = useResource(orgId);
  const { data: projectSpace } = useResource(projSpaceId);
  const { data: repositories, isLoading } = useRepositories(
    projSpaceId,
    page,
    sorting,
    sortOrder,
    searchTerm
  );

  const [rename, setRename] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>(projectSpace?.resource_name);
  const renameModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        rename &&
        renameModalRef.current &&
        !renameModalRef.current.contains(event.target as Node)
      ) {
        setRename(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [rename]);

  return (
    <div>
      <div className="flex flex-col">
        <div className="flex justify-between mb-4">
          <div className="flex flex-col">
            <div className="flex flex-row font-bold text-[24px] ml-[-8px]">
              <h1
                className="cursor-pointer px-2 hover:bg-ci-modal-black rounded-md"
                onClick={() => {
                  router.push(`/organization/${orgId}/`);
                }}
              >
                {organization?.resource_name}
              </h1>
              <h1 className="mx-1">/</h1>
              <h1 className="px-2">{projectSpace?.resource_name}</h1>
            </div>
            <h2 className="font-medium text-[16px] text-ci-modal-grey">
              Owner: user 1
            </h2>
          </div>
          <div className="flex gap-8 my-2">
            <Button
              className="h-10 w-60 text-[18px] border border-ci-modal-grey px-6 py-1 bg-ci-modal-black rounded-md font-semibold hover:bg-ci-modal-blue transition-all duration-300 ease-in-out"
              onClick={() => setRename(true)}
            >
              Rename Project Space
            </Button>
            <Button
              className="h-10 w-60 text-[18px] border border-ci-modal-grey px-6 py-1 bg-ci-modal-black rounded-md font-semibold hover:bg-ci-modal-blue transition-all duration-300 ease-in-out"
              onClick={() =>
                router.push(
                  `/organization/${orgId}/project-space/${projSpaceId}/new-repository`
                )
              }
            >
              New Repository
            </Button>
          </div>
        </div>
        <div className="flex flex-row items-center gap-8 h-10">
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
      {repositories && !isLoading ? (
        <div className="grid grid-cols-2 gap-8">
          {repositories?.data.map((repo: Resource, index: number) => (
            <div key={index}>
              <RepositoryButton repository={repo} />
            </div>
          ))}
        </div>
      ) : (
        <Spin />
      )}
      <div className="mt-4 flex justify-center w-full">
        <Pagination
          current={page}
          total={repositories?.total}
          pageSize={pageSize}
          onChange={setPage}
        />
      </div>
      {rename && (
        <RenamePopup
          renameModalRef={renameModalRef}
          projectSpace={projectSpace}
          newName={newName}
          setNewName={setNewName}
          setRename={setRename}
        />
      )}
    </div>
  );
}
