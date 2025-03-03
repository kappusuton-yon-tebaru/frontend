"use client";

import BranchManager from "@/components/BranchManager";
import { useProjectRepo, useResource } from "@/hooks/workspace";
import { Spin } from "antd";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

export default function Repository() {
  const folders = [
    {
      name: "Folder 1",
      date: "31 Feb 2099",
      time: "14:30",
      msg: "Commit 1",
      type: "folder",
    },
    {
      name: "Folder 2",
      date: "31 Feb 2099",
      time: "10:00",
      msg: "Commit 1",
      type: "folder",
    },
  ];
  const files = [
    {
      name: "File 1",
      date: "31 Feb 2099",
      time: "14:30",
      msg: "Commit 1",
      type: "file",
    },
    {
      name: "File 2",
      date: "31 Feb 2099",
      time: "10:00",
      msg: "Commit 1",
      type: "file",
    },
  ];

  const router = useRouter();
  const { orgId, projSpaceId, repoId } = useParams();

  if (typeof orgId === "undefined" || Array.isArray(orgId)) {
    throw new Error("Invalid orgId");
  }

  if (typeof projSpaceId === "undefined" || Array.isArray(projSpaceId)) {
    throw new Error("Invalid projSpaceId");
  }

  if (typeof repoId === "undefined" || Array.isArray(repoId)) {
    throw new Error("Invalid repoId");
  }

  const { data: projectRepo, isLoading } = useProjectRepo(repoId);
  const gitRepoUrl = projectRepo?.git_repo_url;
  const owner = gitRepoUrl?.split("/").at(-2);
  const repo = gitRepoUrl?.split("/").at(-1);

  const { data: organization } = useResource(orgId);
  const { data: projectSpace } = useResource(projSpaceId);
  const { data: repository } = useResource(repoId);

  const branches = ["main", "branch 1", "branch 2"];
  const itemArr = folders.concat(files);

  if (isLoading) {
    return <Spin />;
  }
  return (
    <div>
      <div className="flex flex-row gap-x-6">
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
            <h1
              className="cursor-pointer px-2 hover:bg-ci-modal-black rounded-md"
              onClick={() => {
                router.push(
                  `/organization/${orgId}/project-space/${projSpaceId}`
                );
              }}
            >
              {projectSpace?.resource_name}
            </h1>
            <h1 className="mx-1">/</h1>
            <h1 className="px-2">{repository?.resource_name}</h1>
          </div>
          <h2 className="font-medium text-[16px] text-ci-modal-grey">
            Owner: user 1
          </h2>
        </div>
        <div className="relative">
          <BranchManager branches={branches} />
        </div>
      </div>
      <div className="bg-ci-modal-black text-white rounded-lg w-full border border-ci-modal-grey mt-4">
        <div className="divide-y divide-ci-modal-grey">
          {itemArr.map((item, index) => (
            <div
              key={index}
              className="flex items-center p-4 transition cursor-pointer"
            >
              <Image
                src={`/${item.type}-icon.svg`}
                alt={`${item.type}-icon`}
                width={24}
                height={24}
                className="mr-3"
              />
              <div className="grid grid-cols-3 w-full">
                <div className="font-medium">{item.name}</div>
                <div className="text-ci-modal-grey flex justify-center">
                  {item.msg}
                </div>
                <div className="text-ci-modal-grey flex justify-end">
                  {item.date + ", " + item.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
