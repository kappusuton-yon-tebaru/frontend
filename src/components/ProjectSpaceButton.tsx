import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Resource } from "@/interfaces/workspace";
import { useRepositories } from "@/hooks/workspace";

export default function ProjectSpaceButton({
  projectSpace,
}: {
  projectSpace: Resource;
}) {
  const [option, setOption] = useState(false);
  const [rename, setRename] = useState(false);
  const [del, setDel] = useState(false);
  const [newName, setNewName] = useState(projectSpace.resource_name);
  const [repoNum, setRepoNum] = useState<number>(-1);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const renameModalRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  const { data: repositories } = useRepositories(projectSpace.id, 1);

  useEffect(() => {
    setRepoNum(repositories?.total);
  }, [repositories]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOption(false);
      }

      if (
        rename &&
        renameModalRef.current &&
        !renameModalRef.current.contains(event.target as Node)
      ) {
        setRename(false);
      }

      if (
        del &&
        deleteModalRef.current &&
        !deleteModalRef.current.contains(event.target as Node)
      ) {
        setDel(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [rename, del]);

  return (
    <div className="flex justify-between border border-ci-modal-grey rounded-lg bg-ci-modal-black w-full text-left shadow-lg hover:bg-ci-modal-blue">
      <div className="flex flex-col px-4 py-3">
        <div className="font-semibold text-[16px]">
          {projectSpace.resource_name}
        </div>
        <div className="text-ci-modal-grey font-medium gap-4 text-[14px]">
          <div>{repoNum !== -1 && repoNum} Repositories</div>
          <div>Owner: user 1234567890</div>
        </div>
      </div>

      <div
        className="flex justify-center relative"
        onClick={(e) => {
          e.stopPropagation();
          setOption(!option);
        }}
      >
        <Image
          className="flex-shrink-0"
          src={"/three-point.svg"}
          alt="edit-icon"
          width={24}
          height={24}
        />

        {option && (
          <div
            className="flex flex-col absolute border border-ci-modal-grey rounded-sm left-1 top-1 bg-ci-bg-dark-blue gap-1 font-medium shadow-lg"
            ref={dropdownRef}
          >
            <div
              className="flex justify-center text-ci-modal-white w-full px-4 py-2 hover:bg-ci-modal-blue"
              onClick={() => {
                setRename(true);
                setOption(false);
              }}
            >
              Rename
            </div>
            <div
              className="flex justify-center text-ci-status-red w-full px-4 py-2 hover:bg-ci-modal-blue"
              onClick={() => {
                setDel(true);
                setOption(false);
              }}
            >
              Delete
            </div>
          </div>
        )}
      </div>

      {rename && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="flex flex-col bg-ci-modal-dark-blue p-6 rounded-md shadow-lg w-[700px] h-[400px] gap-8 justify-center"
            ref={renameModalRef}
          >
            <div className="flex text-4xl font-bold text-ci-modal-white mb-3 justify-center">
              Rename Project Space
            </div>
            <input
              type="text"
              className="mx-16 px-3 py-2 font-medium border border-ci-modal-grey rounded-md focus:outline-none bg-ci-bg-dark-blue"
              placeholder={projectSpace.resource_name}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <div className="flex mx-16 mt-4 gap-8">
              <button
                className="px-4 py-2 text-white font-semibold bg-ci-bg-dark-blue rounded-md w-full"
                onClick={() => {
                  console.log("Renaming to:", newName);
                  setRename(false);
                }}
              >
                Confirm
              </button>
              <button
                className="px-4 py-2 text-white font-semibold bg-ci-modal-red rounded-md w-full"
                onClick={() => setRename(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {del && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="flex flex-col bg-ci-modal-dark-blue p-6 rounded-md shadow-lg w-[700px] h-[400px] gap-8 justify-center"
            ref={deleteModalRef}
          >
            <div className="flex text-4xl font-bold text-ci-modal-white mb-3 justify-center">
              Delete Project
            </div>
            <div className="flex text-xl font-bold text-ci-modal-white mb-3 justify-center">
              Are you sure you want to delete&nbsp;
              <span className="text-ci-modal-light-blue inline-block">
                {projectSpace.resource_name}
              </span>
              &nbsp;?
            </div>
            <div className="flex mx-16 mt-4 gap-8">
              <button
                className="px-4 py-2 text-white font-semibold bg-ci-bg-dark-blue rounded-md w-full"
                onClick={() => setDel(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white font-semibold bg-ci-modal-red rounded-md w-full"
                onClick={() => {
                  console.log("Project Deleted");
                  setDel(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
