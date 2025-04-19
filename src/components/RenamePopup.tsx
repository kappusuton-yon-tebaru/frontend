import { Resource } from "@/interfaces/workspace";
import { putData } from "@/services/baseRequest";
import { Dispatch, RefObject, SetStateAction } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function RenamePopup({
  renameModalRef,
  resource,
  type,
  newName,
  setNewName,
  setRename,
}: {
  renameModalRef: RefObject<HTMLDivElement | null>;
  resource: Resource;
  type: string;
  newName: string;
  setNewName: Dispatch<SetStateAction<string>>;
  setRename: Dispatch<SetStateAction<boolean>>;
}) {
  const handleRename = () => {
    try {
      const renamePayload = {
        resource_name: newName,
      };
      const operation = putData(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/resources/${resource.id}`,
        renamePayload
      );
      window.location.reload();
      if (type === "Project Space") {
        toast.success("Rename Project Space successfully");
      } else if (type === "Organization") {
        toast.success("Rename Organization successfully");
      }
    } catch (e: any) {
      const errorMessage =
        e?.response?.data?.message || e?.message || "Something went wrong.";
      toast.error(errorMessage);
    }
  };
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-default z-30"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="flex flex-col bg-ci-modal-dark-blue p-6 rounded-md shadow-lg w-[700px] h-[400px] gap-8 justify-center"
        ref={renameModalRef}
      >
        <div className="flex text-4xl font-bold text-ci-modal-white mb-3 justify-center">
          Rename {type === "Project Space" ? "Project Space" : "Organization"}
        </div>
        <input
          type="text"
          className="mx-16 px-3 py-2 font-medium border border-ci-modal-grey rounded-md focus:outline-none bg-ci-bg-dark-blue"
          placeholder={resource?.resource_name}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <div className="flex mx-16 mt-4 gap-8">
          <button
            className="px-4 py-2 text-white font-semibold bg-ci-bg-dark-blue rounded-md w-full"
            onClick={() => {
              setRename(false);
              handleRename();
            }}
          >
            Confirm
          </button>
          <button
            className="px-4 py-2 text-white font-semibold bg-ci-modal-red rounded-md w-full"
            onClick={() => {
              setRename(false);
              setNewName(resource.resource_name);
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          success: {
            style: {
              background: "#4CAF50",
              color: "white",
            },
          },
          error: {
            style: {
              background: "#F44336",
              color: "white",
            },
          },
        }}
      />
    </div>
  );
}
