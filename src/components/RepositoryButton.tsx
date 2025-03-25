import { useAllUserRepos, useBranches } from "@/hooks/github";
import { useProjectRepo } from "@/hooks/workspace";
import { Resource } from "@/interfaces/workspace";
import { Spin } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RepositoryButton({
  repository,
}: {
  repository: Resource;
}) {
  const router = useRouter();
  const { orgId, projSpaceId } = useParams();
  const [branchNum, setBranchNum] = useState(-1);
  const token = localStorage.getItem("access_token");
  const { data: projectRepo, isLoading } = useProjectRepo(repository.id);
  const gitRepoUrl = projectRepo?.git_repo_url;
  const owner = gitRepoUrl?.split("/").at(-2);
  const repo = gitRepoUrl?.split("/").at(-1);
  const [repoType, setRepoType] = useState<string>("");

  let tokenAuth = "";
  if (token !== null) {
    tokenAuth = token;
  }
  const { data: branches } = useBranches(owner, repo, tokenAuth);
  const { data: userRepos } = useAllUserRepos(tokenAuth);
  useEffect(() => {
    if (typeof branches !== "undefined" && branches.data) {
      setBranchNum(branches.data.length);
    }
  }, [branches]);

  useEffect(() => {
    if (userRepos) {
      for (const r of userRepos) {
        if (r.full_name === `${owner}/${repo}`) {
          if (r.private === false) {
            setRepoType("public");
          } else {
            setRepoType("private");
          }
          break;
        }
      }
    }
  }, [userRepos]);

  if (isLoading || !owner || !repo) return <Spin />;
  return (
    <div
      className="flex justify-between border border-ci-modal-grey rounded-lg bg-ci-modal-black w-full text-left cursor-pointer shadow-lg hover:bg-ci-modal-blue"
      onClick={
        branchNum !== 0
          ? () =>
              router.push(
                `/organization/${orgId}/project-space/${projSpaceId}/repository/${repository.id}`
              )
          : undefined
      }
    >
      <div className="flex flex-col px-4 py-3 gap-2">
        <div className="flex flex-row gap-4">
          <div className="font-semibold text-[16px]">
            {repository.resource_name}
          </div>
          <div className="flex rounded-full px-2 border text-[14px] items-center">
            {repoType}
          </div>
        </div>
        <div className="flex flex-row text-ci-modal-grey font-medium gap-4 text-[14px]">
          {branchNum === 0 ? (
            <div className="text-ci-modal-red">
              You must setup this repository in GitHub first
            </div>
          ) : (
            <>
              <div>{branchNum !== -1 && branchNum} Branches</div>
              <div>Owner: user 1234567890</div>
              <div>
                Last Update:{" "}
                {new Date(repository.updated_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
