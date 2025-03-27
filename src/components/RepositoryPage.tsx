"use client";
import RepoItem from "@/components/RepoItem";
import { useToken } from "@/context/TokenContext";
import { useBranches, useRepoContents } from "@/hooks/github";
import { useProjectRepo, useResource } from "@/hooks/workspace";
import { Branch, Content } from "@/interfaces/github";
import { Spin } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BranchButton from "./BranchButton";

export default function RepositoryPage({ branchURL }: { branchURL?: string }) {
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

  const { tokenAuth } = useToken();

  const { data: branches } = useBranches(owner, repo, tokenAuth);
  const [branchesStr, setBranchesStr] = useState<string[]>([]);
  const [currentBranch, setCurrentBranch] = useState<string>("");
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
      if (branchURL) {
        setCurrentBranch(branchURL);
      } else {
        setCurrentBranch(branchList[0]);
      }
    }
  }, [branches]);
  const { data: repoContents } = useRepoContents(
    owner,
    repo,
    tokenAuth,
    "",
    currentBranch
  );
  const [contents, setContents] = useState<Content[]>([]);
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

  if (isLoading || !owner || !repo || !repoContents || !currentBranch) {
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
          {!isLoading && branches ? (
            <BranchButton
              wide={true}
              branches={branchesStr}
              currentBranch={currentBranch}
              onSelectBranch={setCurrentBranch}
              owner={owner}
              repo={repo}
              withCreate={true}
              pushRoute={true}
            />
          ) : (
            <Spin />
          )}
        </div>
        <div>
          <button
            className="border-ci-modal-grey border rounded-md bg-ci-modal-black flex items-center px-3 py-2 text-sm"
            onClick={() => {
              window.open(
                `https://github.com/${owner}/${repo}`,
                "_blank",
                "noopener,noreferrer"
              );
            }}
          >
            Go to GitHub
          </button>
        </div>
      </div>
      <div className="bg-ci-modal-black text-white rounded-lg w-full mt-4">
        <div className="grid grid-cols-[35%_48%_27%] w-full h-12 px-4 items-center border border-ci-modal-grey rounded-t-lg">
          <div className="text-ci-modal-grey">Name</div>
          <div className="text-ci-modal-grey">Last Commit Message</div>
          <div className="text-ci-modal-grey">Last Commit Date</div>
        </div>
        {contents.map((item: Content, index) => (
          <div
            className={`border border-ci-modal-grey ${
              index === contents.length - 1 ? "rounded-b-lg" : ""
            }`}
            key={item.path}
            onClick={() => {
              router.push(
                `/organization/${orgId}/project-space/${projSpaceId}/repository/${repoId}/${currentBranch}/${item.path}`
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
    </div>
  );
}
