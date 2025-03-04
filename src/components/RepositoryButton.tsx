import { useBranches } from "@/hooks/github";
import { useProjectRepo } from "@/hooks/workspace";
import { Resource } from "@/interfaces/workspace";
import { Spin } from "antd";
import { useEffect, useState } from "react";

export default function RepositoryButton({
  repository,
}: {
  repository: Resource;
}) {
  const [branchNum, setBranchNum] = useState(-1);
  const token = localStorage.getItem("access_token");
  const { data: projectRepo, isLoading } = useProjectRepo(repository.id);
  const gitRepoUrl = projectRepo?.git_repo_url;
  const owner = gitRepoUrl?.split("/").at(-2);
  const repo = gitRepoUrl?.split("/").at(-1);

  let tokenAuth = "";
  if (token !== null) {
    tokenAuth = token;
  }
  const { data: branches } = useBranches(owner, repo, tokenAuth);

  useEffect(() => {
    if (typeof branches !== "undefined" && branches.data) {
      setBranchNum(branches.data.length);
    }
  }, [branches]);

  if (isLoading || !owner || !repo) return <Spin />;
  return (
    <div className="flex justify-between border border-ci-modal-grey rounded-lg bg-ci-modal-black w-full text-left shadow-lg hover:bg-ci-modal-blue">
      <div className="flex flex-col px-4 py-3 gap-2">
        <div className="flex flex-row gap-4">
          <div className="font-semibold text-[16px]">
            {repository.resource_name}
          </div>
          <div className="flex rounded-full px-2 border text-[14px] items-center">
            private
          </div>
        </div>
        <div className="flex flex-row text-ci-modal-grey font-medium gap-4 text-[14px]">
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
        </div>
      </div>
    </div>
  );
}
