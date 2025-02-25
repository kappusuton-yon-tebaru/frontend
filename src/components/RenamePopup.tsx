import { Resource } from "@/interfaces/workspace";
import { Dispatch, RefObject, SetStateAction } from "react";

export default function RenamePopup({
  renameModalRef,
  projectSpace,
  newName,
  setNewName,
  setRename,
}: {
  renameModalRef: RefObject<HTMLDivElement | null>;
  projectSpace: Resource;
  newName: string;
  setNewName: Dispatch<SetStateAction<string>>;
  setRename: Dispatch<SetStateAction<boolean>>;
}) {
  return (
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
            onClick={() => {
              setRename(false);
              setNewName(projectSpace.resource_name);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
