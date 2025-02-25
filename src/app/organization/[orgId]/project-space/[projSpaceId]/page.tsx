"use client";

import RenamePopup from "@/components/RenamePopup";
import RepositoryButton from "@/components/RepositoryButton";
import { useOrganization, useRepositories } from "@/hooks/workspace";
import { Resource } from "@/interfaces/workspace";
import { Pagination, Spin, Button } from "antd";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
  const pageSize = 2;

  const { data: organization } = useOrganization(orgId);
  const { data: projectSpace } = useOrganization(projSpaceId);
  const { data: repositories, isLoading } = useRepositories(projSpaceId, page);

  const [rename, setRename] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>(projectSpace?.resource_name);
  const renameModalRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div className="flex flex-row justify-between">
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
            className="h-full text-[18px] border border-ci-modal-grey px-6 py-1 bg-ci-modal-black rounded-md font-semibold hover:bg-ci-modal-blue transition-all duration-300 ease-in-out"
            onClick={() => setRename(true)}
          >
            Rename Project Space
          </Button>
          <Button
            className="h-full text-[18px] border border-ci-modal-grey px-6 py-1 bg-ci-modal-black rounded-md font-semibold hover:bg-ci-modal-blue transition-all duration-300 ease-in-out"
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
      <hr className="my-6 mx-[-20px] border-ci-modal-grey"></hr>
      {repositories && !isLoading ? (
        <div className="grid grid-cols-2 gap-8">
          {repositories?.data.map((repo: Resource, index: number) => (
            <div
              key={index}
              onClick={() =>
                router.push(
                  `/organization/${orgId}/project-space/${projSpaceId}/repository/${repo.id}`
                )
              }
              className="cursor-pointer"
            >
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
