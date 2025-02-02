import BranchButton from "@/components/codeeditor/BranchButton";
import MergeButton from "@/components/codeeditor/MergeButton";
import BranchManager from "@/components/codeeditor/BranchManager";

export default function RepositoryPage() {
  const branches = ["main", "branch 1", "branch 2"];
  let currentBranch = branches[0];

  return (
    <>
      <div className="bg-ci-bg-dark-blue w-screen flex flex-col px-16 py-16">
        <div className="flex flex-row gap-8">
          <div className="text-ci-modal-white font-bold text-2xl">
            Repository 1
          </div>
          {/* <BranchButton branches={branches} currentBranch={currentBranch} />
          <MergeButton branches={branches} currentBranch={currentBranch} /> */}
          <BranchManager branches={branches} />
        </div>
      </div>
    </>
  );
}
