"use client";

import { useState } from "react";
import { ChevronDown, GitBranch } from "lucide-react";
import SwitchBranch from "./SwitchBranch";

export default function BranchButton({
  branches,
  currentBranch,
  onSelectBranch,
}: {
  branches: string[];
  currentBranch: string;
  onSelectBranch: (branch: string) => void;
}) {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <div className="relative">
      <button
        className="border-ci-modal-grey border rounded-md px-3 py-2 bg-ci-modal-black w-full flex justify-between items-center gap-2"
        onClick={() => setIsOpened(!isOpened)}
      >
        <GitBranch className="text-ci-modal-white" size={16} />
        <div className="text-ci-modal-white text-sm">{currentBranch}</div>
        <ChevronDown className="text-ci-modal-white" size={16} />
      </button>

      {isOpened && (
        <SwitchBranch
          branches={branches}
          selectedBranch={currentBranch}
          onSelectBranch={(branch) => {
            onSelectBranch(branch);
            setIsOpened(false);
          }}
          onClose={() => setIsOpened(false)}
        />
      )}
    </div>
  );
}
