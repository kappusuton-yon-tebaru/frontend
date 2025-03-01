// import { useBranches } from "@/hooks/github";
import { Resource } from "@/interfaces/workspace";
// import { getData } from "@/services/baseRequest";
import { useEffect, useState } from "react";

export default function RepositoryButton({
  repository,
}: {
  repository: Resource;
}) {
  const owner = "oreo10baht";
  const repo = "network-final-project";
  const [branchNum, setBranchNum] = useState<number>(-1);
  const [branches, setBranches] = useState();
  //   const { data: branches } = useBranches(owner, repo);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const getBranches = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/github/${owner}/${repo}/branches`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching metadata: ${response.status} - ${response.statusText}`
        );
      }
      const data = await response.json();
      setBranches(data.data);
      setBranchNum(data.data.length);
    };
    getBranches();
  }, []);

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
