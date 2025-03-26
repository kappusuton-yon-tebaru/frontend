import { postData } from "@/services/baseRequest";
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import BranchButton from "./BranchButton";
import { useParams, useRouter } from "next/navigation";
import { useToken } from "@/context/TokenContext";

export default function CreateBranchPopup({
  createBranchModalRef,
  branches,
  owner,
  repo,
  branchName,
  setBranchName,
  setCreateBranch,
}: {
  createBranchModalRef: RefObject<HTMLDivElement | null>;
  branches: string[];
  owner: string;
  repo: string;
  branchName: string;
  setBranchName: Dispatch<SetStateAction<string>>;
  setCreateBranch: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { orgId, projSpaceId, repoId } = useParams();
  const { tokenAuth } = useToken();
  const [currentBranch, setCurrentBranch] = useState<string>(branches[0]);
  const handleCreateBranch = async () => {
    try {
      const operation = await postData(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/github/${owner}/${repo}/create-branch?branch_name=${branchName}&selected_branch=${currentBranch}`,
        "",
        tokenAuth
      );
      router.push(
        `/organization/${orgId}/project-space/${projSpaceId}/repository/${repoId}/${branchName}`
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-default z-30"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="flex flex-col bg-ci-modal-dark-blue p-6 rounded-md shadow-lg w-[700px] h-[400px] gap-8 justify-center"
        ref={createBranchModalRef}
      >
        <div className="flex text-4xl font-bold text-ci-modal-white mb-3 justify-center">
          Create New Branch
        </div>
        <input
          type="text"
          className="mx-16 px-3 py-2 font-medium border border-ci-modal-grey rounded-md focus:outline-none bg-ci-bg-dark-blue"
          placeholder="Create New Branch"
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
        />
        <div className="flex flex-col gap-2 mx-16">
          <div>Source branch</div>
          <div>
            <BranchButton
              wide={false}
              branches={branches}
              currentBranch={currentBranch}
              onSelectBranch={setCurrentBranch}
              owner={owner}
              repo={repo}
              withCreate={false}
              pushRoute={false}
            />
          </div>
        </div>
        <div className="flex mx-16 mt-4 gap-8">
          <button
            className="px-4 py-2 text-white font-semibold bg-ci-bg-dark-blue rounded-md w-full"
            onClick={() => {
              setCreateBranch(false);
              handleCreateBranch();
            }}
          >
            Confirm
          </button>
          <button
            className="px-4 py-2 text-white font-semibold bg-ci-modal-red rounded-md w-full"
            onClick={() => {
              setCreateBranch(false);
              setBranchName("");
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
