"use client";
import BranchButton from "./BranchButton";
import MergeButton from "./MergeButton";

export default function BranchManager({
  branches,
  currentBranch,
  setCurrentBranch,
  owner,
  repo,
}: {
  branches: string[];
  currentBranch: string;
  setCurrentBranch: (branch: string) => void;
  owner: string;
  repo: string;
}) {
  return (
    <div className="flex flex-row gap-6">
      <BranchButton
        wide={true}
        branches={branches}
        currentBranch={currentBranch}
        onSelectBranch={setCurrentBranch}
        owner={owner}
        repo={repo}
        withCreate={true}
        pushRoute={true}
      />
      <MergeButton branches={branches} currentBranch={currentBranch} />
    </div>
  );
}
