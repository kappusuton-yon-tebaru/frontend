import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Resource } from "@/interfaces/workspace";
import RenamePopup from "./RenamePopup";
import DeletePopup from "./DeletePopup";
import { getData } from "@/services/baseRequest";
import toast, { Toaster } from "react-hot-toast";

export default function OrganizationPageButton({
  organization,
}: {
  organization: Resource;
}) {
  const [option, setOption] = useState<boolean>(false);
  const [rename, setRename] = useState<boolean>(false);
  const [del, setDel] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>(organization.resource_name);
  const [projSpaceNum, setprojSpaceNum] = useState<number>(-1);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const renameModalRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProjectSpaceNum = async () => {
      try {
        const response = await getData(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/resources/children/${organization.id}`
        );
        setprojSpaceNum(response?.total);
      } catch (e: any) {
        const errorMessage =
          e?.response?.data?.message || e?.message || "Something went wrong.";
        toast.error(errorMessage);
      }
    };

    if (organization?.id) {
      fetchProjectSpaceNum();
    }
  }, [organization]);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    const hours = date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${day} ${month} ${year} ${hours}`;
  };

  return (
    <div className="flex justify-between border border-ci-modal-grey rounded-lg bg-ci-modal-black w-full text-left shadow-lg hover:bg-ci-modal-blue">
      <div className="flex flex-col px-4 py-3">
        <div className="font-semibold text-[16px]">
          {organization.resource_name}
        </div>
        <div className="text-ci-modal-grey font-medium gap-4 text-[14px]">
          <div>{projSpaceNum !== -1 && projSpaceNum} Project spaces</div>
          <div>Owner: user 1234567890</div>
          <div>Last Updated: {formatDate(organization.updated_at)}</div>
          <div>Date Created: {formatDate(organization.created_at)}</div>
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
          className="flex-shrink-0 hover:bg-[#336FB2] rounded-full my-auto mr-1"
          src={"/three-point.svg"}
          alt="edit-icon"
          width={32}
          height={32}
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
        <RenamePopup
          renameModalRef={renameModalRef}
          resource={organization}
          type="Organization"
          newName={newName}
          setNewName={setNewName}
          setRename={setRename}
        />
      )}

      {del && (
        <DeletePopup
          deleteModalRef={deleteModalRef}
          resource={organization}
          type="Organization"
          setDel={setDel}
        />
      )}

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
