"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import SwitchBranch from "./SwitchBranch";
import Image from "next/image";

export default function BranchButton({
  wide,
  branches,
  currentBranch,
  onSelectBranch,
}: {
  wide: boolean;
  branches: string[];
  currentBranch: string;
  onSelectBranch: (branch: string) => void;
}) {
  const [isOpened, setIsOpened] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpened(false);
      }
    }
    if (isOpened) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpened]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="border-ci-modal-grey border rounded-md px-3 py-2 bg-ci-modal-black w-full flex items-center justify-between"
        onClick={() => setIsOpened(!isOpened)}
      >
        <div className="flex items-center gap-2 mr-2">
          <Image
            src={`/git-branch-icon.svg`}
            alt="git-branch-icon"
            width={20}
            height={20}
          />
          <div className="text-ci-modal-white text-sm">{currentBranch}</div>
        </div>
        <ChevronDown className="text-ci-modal-white" size={16} />
      </button>

      {isOpened && (
        <SwitchBranch
          wide={wide}
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
