"use client";

import { X } from "lucide-react";

export default function SwitchBranch({
  wide,
  branches,
  selectedBranch,
  onSelectBranch,
  onClose,
}: {
  wide: boolean;
  branches: string[];
  selectedBranch: string;
  onSelectBranch: (branch: string) => void;
  onClose: () => void;
}) {
  return (
    <div
      className={`absolute ${
        wide ? "w-[200%]" : "w-full"
      } bg-ci-bg-dark-blue border border-ci-modal-white mt-2 rounded-md shadow-lg z-10`}
    >
      <div className="flex justify-between items-center px-3 py-2 border-b border-ci-modal-grey">
        <span className="text-ci-modal-white font-medium">Switch Branch</span>
        <X
          className="text-ci-modal-white cursor-pointer"
          size={20}
          onClick={onClose}
        />
      </div>

      <div className="max-h-60 overflow-y-auto">
        {branches.map((branch, index) => (
          <div
            key={branch}
            className={`flex justify-between items-center px-3 py-2 cursor-pointer hover:bg-ci-modal-blue ${
              branch === selectedBranch
                ? "bg-ci-modal-blue text-white"
                : "text-ci-modal-white"
            } ${index === branches.length - 1 ? "rounded-b-md" : ""}`}
            onClick={() => {
              onSelectBranch(branch);
              onClose();
            }}
          >
            <span className="text-sm">
              {branch}
              {branch === selectedBranch && (
                <span className="text-ci-modal-grey"> (current branch)</span>
              )}
            </span>

            <div className="flex items-center gap-2">
              {index === 0 && (
                <span className="text-xs px-2 py-1 border border-ci-modal-grey rounded-full">
                  default
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
