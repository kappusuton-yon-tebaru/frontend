"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import BranchButton from "@/components/BranchButton";
import { useParams, useRouter } from "next/navigation";
import { useProjectRepo, useResource } from "@/hooks/workspace";
import {
  useBranches,
  useCommitMetadata,
  useRepoContents,
} from "@/hooks/github";
import { Branch, Content } from "@/interfaces/github";
import { Spin } from "antd";
import FileAndFolderBar from "@/components/FileAndFolderBar";
import RepoItem from "@/components/RepoItem";
import CodeEditor from "@/components/CodeEditor";
import { useToken } from "@/context/TokenContext";

export default function FileAndFolder() {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const router = useRouter();
  const { orgId, projSpaceId, repoId, branch, path } = useParams();

  if (typeof orgId === "undefined" || Array.isArray(orgId)) {
    throw new Error("Invalid orgId");
  }

  if (typeof projSpaceId === "undefined" || Array.isArray(projSpaceId)) {
    throw new Error("Invalid projSpaceId");
  }

  if (typeof repoId === "undefined" || Array.isArray(repoId)) {
    throw new Error("Invalid repoId");
  }

  if (typeof branch === "undefined" || Array.isArray(branch)) {
    throw new Error("Invalid branch");
  }

  if (typeof path === "undefined") {
    throw new Error("Invalid path");
  }
  const fullPath = Array.isArray(path) ? path.join("/") : path || "";
  let backPath = "";
  if (path.length > 1) {
    backPath = Array.isArray(path)
      ? path.slice(0, path.length - 1).join("/")
      : "";
  }
  const { data: projectRepo, isLoading } = useProjectRepo(repoId);
  const gitRepoUrl = projectRepo?.git_repo_url;
  const owner = gitRepoUrl?.split("/").at(-2);
  const repo = gitRepoUrl?.split("/").at(-1);

  const { data: organization } = useResource(orgId);
  const { data: projectSpace } = useResource(projSpaceId);
  const { data: repository } = useResource(repoId);

  const { tokenAuth } = useToken();

  const { data: branches } = useBranches(owner, repo, tokenAuth);
  const [branchesStr, setBranchesStr] = useState<string[]>([]);
  const [currentBranch, setCurrentBranch] = useState<string>(branch);
  useEffect(() => {
    const branchList: string[] = [];
    if (typeof branches !== "undefined" && branches.data) {
      branches.data.map((br: Branch) => {
        if (br.name === "main") {
          branchList.unshift(br.name);
        } else {
          branchList.push(br.name);
        }
      });
      setBranchesStr(branchList);
      setCurrentBranch(branch);
    }
  }, [branches]);

  const { data: fullRepoContents } = useRepoContents(
    owner,
    repo,
    tokenAuth,
    "",
    currentBranch
  );

  const shouldFetch = path[path.length - 1].split(".").length === 1;

  const repoContentsResult = shouldFetch
    ? useRepoContents(owner, repo, tokenAuth, fullPath, currentBranch)
    : { data: [] };

  const { data: repoContents } = repoContentsResult;

  useEffect(() => {
    if (shouldFetch && Array.isArray(repoContents)) {
      const sortedContents = [...repoContents].sort((a, b) => {
        return a.download_url === "" && b.download_url !== "" ? -1 : 1;
      });
      setContents(sortedContents);
    }
  }, [repoContents]);

  const [contents, setContents] = useState<Content[]>([]);
  const { data: commitInfo } = useCommitMetadata(
    owner,
    repo,
    tokenAuth,
    fullPath,
    currentBranch
  );

  const handleSave = (content: string) => {
    setIsEditing(false);
  };

  if (
    isLoading ||
    !owner ||
    !repo ||
    !fullRepoContents ||
    !currentBranch ||
    !commitInfo
  ) {
    return <Spin />;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    const hours = date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${day} ${month} ${year} ${hours}`;
  };

  return (
    <div>
      <div className="flex flex-row font-bold text-[24px] ml-[-8px] mb-2">
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
            router.push(`/organization/${orgId}/project-space/${projSpaceId}`);
          }}
        >
          {projectSpace?.resource_name}
        </h1>
        <h1 className="mx-1">/</h1>
        <h1
          className="cursor-pointer px-2 hover:bg-ci-modal-black rounded-md"
          onClick={() => {
            router.push(
              `/organization/${orgId}/project-space/${projSpaceId}/repository/${repoId}`
            );
          }}
        >
          {repository?.resource_name}
        </h1>
      </div>
      <div className="grid grid-cols-[25%_75%] gap-4 h-full">
        <div className="flex flex-col gap-y-4 h-full">
          <div className="relative w-full">
            <BranchButton
              wide={false}
              branches={branchesStr}
              currentBranch={currentBranch}
              onSelectBranch={setCurrentBranch}
              owner={owner}
              repo={repo}
              withCreate={false}
              pushRoute={true}
            />
          </div>
          <FileAndFolderBar
            repoContents={fullRepoContents}
            owner={owner}
            repo={repo}
            currentBranch={currentBranch}
          />
        </div>

        <div className="p-4 bg-ci-modal-black rounded-lg border border-ci-modal-grey h-full">
          <div className="flex justify-between items-center pb-2">
            <div className="flex flex-row gap-6 items-center">
              <div>{fullPath}</div>
              <div className="text-ci-modal-grey">
                {commitInfo ? commitInfo.commitMessage : <Spin />}
              </div>
            </div>
            <div className="flex flex-row gap-6 items-center">
              {!isEditing && path[path.length - 1].split(".").length !== 1 && (
                <button
                  className="border rounded-lg p-2 hover:bg-ci-modal-blue transition-colors group"
                  onClick={() => setIsEditing(true)}
                  aria-label="Edit"
                >
                  <Image
                    src="/edit-icon.svg"
                    alt="Edit"
                    width={16}
                    height={16}
                    className="group-hover:scale-110 transition-transform"
                  />
                </button>
              )}
              <div className="text-ci-modal-grey">
                {commitInfo ? formatDate(commitInfo.lastEditTime) : <Spin />}
              </div>
            </div>
          </div>
          {shouldFetch ? (
            <div className="bg-ci-modal-black text-white rounded-lg w-full mt-4">
              <div className="grid grid-cols-[35%_48%_27%] w-full h-12 px-4 items-center border border-ci-modal-grey rounded-t-lg">
                <div className="text-ci-modal-grey">Name</div>
                <div className="text-ci-modal-grey">Last Commit Message</div>
                <div className="text-ci-modal-grey">Last Commit Date</div>
              </div>
              {backPath !== "" && (
                <div
                  className="flex w-full h-12 px-4 items-center border border-ci-modal-grey hover:cursor-pointer"
                  onClick={() => {
                    router.push(
                      `/organization/${orgId}/project-space/${projSpaceId}/repository/${repoId}/${branch}/${backPath}`
                    );
                  }}
                >
                  <Image
                    src={"/folder-icon.svg"}
                    alt="folder"
                    width={24}
                    height={24}
                    className="mr-3"
                  />
                  <div className="text-ci-modal-grey">...</div>
                </div>
              )}
              {contents.map((item: Content, index) => (
                <div
                  className={`border border-ci-modal-grey ${
                    index === contents.length - 1 ? "rounded-b-lg" : ""
                  }`}
                  key={item.path}
                  onClick={() => {
                    router.push(
                      `/organization/${orgId}/project-space/${projSpaceId}/repository/${repoId}/${branch}/${item.path}`
                    );
                  }}
                >
                  <RepoItem
                    item={item}
                    owner={owner}
                    repo={repo}
                    currentBranch={currentBranch}
                  />
                </div>
              ))}
            </div>
          ) : (
            <CodeEditor
              owner={owner}
              repo={repo}
              token={tokenAuth}
              path={fullPath}
              branch={branch}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          )}
        </div>
      </div>
    </div>
  );
}
