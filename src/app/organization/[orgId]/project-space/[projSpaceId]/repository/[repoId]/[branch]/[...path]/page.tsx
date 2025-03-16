"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { dracula } from "@uiw/codemirror-theme-dracula";
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

export default function FileAndFolder() {
  const [code, setCode] = useState("// Start typing...");
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

  const token = localStorage.getItem("access_token");
  let tokenAuth = "";
  if (token !== null) {
    tokenAuth = token;
  }
  const { data: branches } = useBranches(owner, repo, tokenAuth);
  const [branchesStr, setBranchesStr] = useState<string[]>([]);
  const [currentBranch, setCurrentBranch] = useState<string>(branch);
  useEffect(() => {
    let branchList: string[] = [];
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
  if (path[path.length - 1].split(".").length === 1) {
    const { data: repoContents } = useRepoContents(
      owner,
      repo,
      tokenAuth,
      fullPath,
      currentBranch
    );
    useEffect(() => {
      if (Array.isArray(repoContents)) {
        const sortedContents = [...repoContents].sort((a, b) => {
          return a.download_url === "" && b.download_url !== "" ? -1 : 1;
        });
        setContents(sortedContents);
      } else {
        setContents([]);
      }
    }, [repoContents]);
  }
  const [contents, setContents] = useState<Content[]>([]);
  const { data: commitInfo } = useCommitMetadata(
    owner,
    repo,
    tokenAuth,
    fullPath,
    currentBranch
  );
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
      <div className="grid grid-cols-[25%_75%] gap-4">
        <div className="flex flex-col gap-y-4">
          <div className="relative w-full">
            <BranchButton
              wide={false}
              branches={branchesStr}
              currentBranch={currentBranch}
              onSelectBranch={setCurrentBranch}
            />
          </div>

          <FileAndFolderBar
            repoContents={fullRepoContents}
            owner={owner}
            repo={repo}
            tokenAuth={tokenAuth}
            currentBranch={currentBranch}
          />

          <textarea
            name=""
            id=""
            placeholder="Commit Message"
            className="rounded-lg flex items-center text-black p-2 h-10"
          />
          <button className="bg-ci-bg-dark-blue w-full border border-ci-modal-grey py-2 rounded-lg">
            Commit and Push
          </button>
        </div>

        <div className="p-4 bg-ci-modal-black rounded-lg border border-ci-modal-grey h-full">
          <div className="flex justify-between items-center">
            <div className="flex flex-row gap-6 items-center">
              <div>{fullPath}</div>
              <div className="text-ci-modal-grey">
                {commitInfo ? commitInfo.commitMessage : <Spin />}
              </div>
            </div>
            <div className="flex flex-row gap-6 items-center">
              {isEditing && (
                <>
                  <button
                    className="border rounded-md px-4 py-1 bg-ci-modal-light-blue"
                    onClick={() => setIsEditing(false)}
                  >
                    Confirm
                  </button>
                  <button
                    className="border rounded-md px-4 py-1 bg-ci-modal-red"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </>
              )}
              <button
                className={`border rounded-lg p-2 ${
                  isEditing && "bg-ci-modal-light-blue"
                }`}
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                <Image
                  src={`/edit-icon.svg`}
                  alt={`edit-icon`}
                  width={16}
                  height={16}
                />
              </button>
              <div className="text-ci-modal-grey">
                {commitInfo ? (
                  new Date(commitInfo.lastEditTime).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                ) : (
                  <Spin />
                )}
              </div>
            </div>
          </div>
          {path[path.length - 1].split(".").length === 1 ? (
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
                    tokenAuth={tokenAuth}
                    currentBranch={currentBranch}
                  />
                </div>
              ))}
            </div>
          ) : (
            <CodeMirror
              value={code}
              // height="660px"
              theme={dracula}
              extensions={[javascript()]}
              onChange={(value) => setCode(value)}
              className="mt-4"
            />
          )}
        </div>
      </div>
    </div>
  );
}
