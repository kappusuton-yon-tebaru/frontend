"use client";

import { useState } from "react";

export default function MergeButton({
  branches,
  currentBranch,
}: {
  branches: string[];
  currentBranch: string;
}) {
  const [isOpened, setIsOpened] = useState<boolean>(false);

  const handleOpen = () => setIsOpened(true);
  const handleClose = () => setIsOpened(false);

  const handleSelectBranch = (branch: string) => {
    setIsOpened(false);
  };

  return (
    <div className="relative">
      <button
        className="text-ci-modal-white text-sm border-ci-modal-grey border w-20 rounded-md px-3 py-2 bg-ci-modal-black flex justify-center items-center"
        onClick={handleOpen}
      >
        Merge
      </button>

      {isOpened && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20"
          onClick={handleClose}
        >
          <div
            className="bg-ci-bg-dark-blue border border-ci-modal-white p-4 rounded-md w-1/3 h-1/2 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center items-center border-b border-ci-modal-grey pb-2 whitespace-nowrap">
              <span className="text-ci-modal-white font-medium">
                Select branch to merge into{" "}
                <span className="text-ci-modal-light-blue font-semibold">
                  {currentBranch}
                </span>
              </span>
            </div>
            <div className="max-h-80 overflow-y-auto mt-2">
              {branches.map((branch) => (
                <div
                  key={branch}
                  className="px-3 py-2 cursor-pointer hover:bg-ci-modal-blue text-ci-modal-white"
                  onClick={() => handleSelectBranch(branch)}
                >
                  {branch}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center">
              <button
                className="w-full text-ci-modal-white text-sm border-ci-modal-grey border rounded-md px-4 py-2 bg-ci-modal-red hover:bg-ci-modal-light-red"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
