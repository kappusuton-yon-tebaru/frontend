"use client";

import { useEffect, useState } from "react";
import BranchButton from "./BranchButton";
import MergeButton from "./MergeButton";

export default function BranchManager({ branches }: { branches: string[] }) {
  const [currentBranch, setCurrentBranch] = useState(branches[0]);
  useEffect(() => {
    setCurrentBranch(branches[0]);
  }, [branches]);

  return (
    <div className="flex flex-row gap-8">
      <BranchButton
        wide={true}
        branches={branches}
        currentBranch={currentBranch}
        onSelectBranch={setCurrentBranch}
      />
      <MergeButton branches={branches} currentBranch={currentBranch} />
    </div>
  );
}
