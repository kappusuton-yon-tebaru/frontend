"use client";

import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CreateBranchPopup from "./CreateBranchPopup";

export default function SwitchBranch({
  wide,
  branches,
  selectedBranch,
  onSelectBranch,
  onClose,
  owner,
  repo,
  withCreate,
  pushRoute,
}: {
  wide: boolean;
  branches: string[];
  selectedBranch: string;
  onSelectBranch: (branch: string) => void;
  onClose: () => void;
  owner: string;
  repo: string;
  withCreate: boolean;
  pushRoute: boolean;
}) {
  const router = useRouter();
  const { orgId, projSpaceId, repoId, branch, path } = useParams();
  const [createBranch, setCreateBranch] = useState<boolean>(false);
  const [branchName, setBranchName] = useState<string>("");
  const createBranchModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        createBranch &&
        createBranchModalRef.current &&
        !createBranchModalRef.current.contains(event.target as Node)
      ) {
        setCreateBranch(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [createBranch]);

  if (typeof orgId === "undefined" || Array.isArray(orgId)) {
    throw new Error("Invalid orgId");
  }

  if (typeof projSpaceId === "undefined" || Array.isArray(projSpaceId)) {
    throw new Error("Invalid projSpaceId");
  }

  if (typeof repoId === "undefined" || Array.isArray(repoId)) {
    throw new Error("Invalid repoId");
  }

  const filePath = Array.isArray(path) ? path.join("/") : null;
  return (
    <div
      className={`absolute ${
        wide ? "w-[200%]" : "w-full"
      } bg-ci-bg-dark-blue border border-ci-modal-white mt-2 rounded-md shadow-lg z-10 flex flex-col`}
    >
      <div className="flex justify-between items-center px-3 py-2">
        <span className="text-ci-modal-white font-medium">Switch Branch</span>
        <X
          className="text-ci-modal-white cursor-pointer hover:bg-ci-modal-black rounded"
          size={20}
          onClick={onClose}
        />
      </div>

      <div className="max-h-60 overflow-y-auto border-y border-ci-modal-grey">
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
              if (pushRoute) {
                if (filePath) {
                  router.push(
                    `/organization/${orgId}/project-space/${projSpaceId}/repository/${repoId}/${encodeURIComponent(
                      branch
                    )}/${filePath}`
                  );
                } else if (branch !== "main") {
                  router.push(
                    `/organization/${orgId}/project-space/${projSpaceId}/repository/${repoId}/${encodeURIComponent(
                      branch
                    )}`
                  );
                } else {
                  router.push(
                    `/organization/${orgId}/project-space/${projSpaceId}/repository/${repoId}`
                  );
                }
              }
            }}
          >
            <span className="text-sm">
              {branch}
              {branch === selectedBranch && pushRoute && (
                <span className="text-ci-modal-grey"> (current branch)</span>
              )}
            </span>

            <div className="flex items-center gap-2">
              {branch === "main" && (
                <span className="text-xs px-2 py-1 border border-ci-modal-grey rounded-full">
                  default
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {withCreate && (
        <div>
          <button
            className="w-full py-2 px-3 text-left text-ci-modal-white bg-ci-bg-dark-blue rounded-b-md hover:bg-ci-modal-blue"
            onClick={() => {
              setCreateBranch(true);
            }}
          >
            Create New Branch
          </button>
        </div>
      )}

      {createBranch && withCreate && (
        <CreateBranchPopup
          createBranchModalRef={createBranchModalRef}
          branches={branches}
          owner={owner}
          repo={repo}
          branchName={branchName}
          setBranchName={setBranchName}
          setCreateBranch={setCreateBranch}
        />
      )}
    </div>
  );
}
