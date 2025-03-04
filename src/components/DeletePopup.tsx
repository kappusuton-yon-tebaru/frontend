import { Resource } from "@/interfaces/workspace";
import { Dispatch, RefObject, SetStateAction } from "react";

export default function DeletePopup({
  deleteModalRef,
  projectSpace,
  setDel,
}: {
  deleteModalRef: RefObject<HTMLDivElement | null>;
  projectSpace: Resource;
  setDel: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-default z-30"
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
  );
}
