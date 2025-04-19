"use client";

import InputField from "@/components/InputField";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { postData } from "@/services/baseRequest";
import { ResourceType } from "@/interfaces/workspace";
import toast, { Toaster } from "react-hot-toast";

export default function NewProjectSpace() {
  const [name, setName] = useState<string>("");
  const { orgId } = useParams();
  const router = useRouter();

  const onClickCreateButton = async () => {
    if (name !== "") {
      try {
        const response = await postData(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/resources`,
          {
            parent_id: orgId,
            resource_name: name,
            resource_type: ResourceType.ProjectSpace,
          }
        );
        router.push(`project-space/${response.resourceId}`);
        toast.success("Create new Project space successfully");
      } catch (e: any) {
        const errorMessage =
          e?.response?.data?.message || e?.message || "Something went wrong.";
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <h1 className="font-bold text-[24px]">Create Project Space</h1>
      <div>
        <div className="w-1/2">
          <InputField
            label="Project Space Name"
            placeholder="Project Space Name"
            value={name}
            onChange={setName}
          />
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          className="text-ci-modal-white text-base font-bold border-ci-modal-grey border w-36 rounded-md px-3 py-2 bg-ci-modal-black hover:bg-ci-modal-blue"
          onClick={onClickCreateButton}
        >
          Create
        </button>
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
