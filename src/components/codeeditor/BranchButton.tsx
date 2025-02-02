"use client";

import { ChevronDown, ChevronUp, GitBranch } from "lucide-react";
import { useState } from "react";
import SwitchBranch from "./SwitchBranch";

export default function BranchButton({ branches }: { branches: string[] }) {
  const [selectedBranch, setSelectedBranch] = useState<string>(branches[0]);
  const [isOpened, setIsOpened] = useState<boolean>(false);

  const handleToggleDropdown = () => {
    setIsOpened((prev) => !prev);
  };

  const handleBranchSelect = (branch: string) => {
    setSelectedBranch(branch);
  };

  return (
    <div className="relative w-60">
      <button
        className="border-ci-modal-grey border rounded-md px-3 py-2 bg-ci-modal-black w-full flex justify-between items-center"
        onClick={handleToggleDropdown}
      >
        <div className="flex items-center gap-2">
          <GitBranch className="text-ci-modal-white" size={16} />
          <span className="text-ci-modal-white text-sm">{selectedBranch}</span>
        </div>
        {isOpened ? (
          <ChevronUp className="text-ci-modal-white" size={16} />
        ) : (
          <ChevronDown className="text-ci-modal-white" size={16} />
        )}
      </button>

      {isOpened && (
        <SwitchBranch
          branches={branches}
          selectedBranch={selectedBranch}
          onSelectBranch={handleBranchSelect}
          onClose={handleToggleDropdown}
        />
      )}
    </div>
  );
}
