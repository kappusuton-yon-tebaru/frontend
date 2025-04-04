"use client";
import InputField from "@/components/InputField";
import { useState } from "react";
import { postData } from "@/services/baseRequest";
import { useRouter } from "next/navigation";
import { ResourceType } from "@/interfaces/workspace";

export default function CreateOrganiazation() {
  const [name, setName] = useState<string>("");
  const router = useRouter();

  const onClickCreateButton = async () => {
    if (name !== "") {
      try {
        const response = await postData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/resources`, {
          resource_name: name,
          resource_type: ResourceType.Organization,
        });
        router.push(`/organization/${response.resourceId}`);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <h1 className="font-bold text-[24px]">Create Organization</h1>
      <div className="w-1/2">
        <InputField
          label={"Organization Name"}
          placeholder={"Organization Name"}
          value={name}
          onChange={setName}
        />
      </div>
      <div className="flex justify-end mt-8">
        <button
          className="text-ci-modal-white text-base font-bold border-ci-modal-grey border w-36 rounded-md px-3 py-2 bg-ci-modal-black hover:bg-ci-modal-blue"
          onClick={onClickCreateButton}
        >
          Create
        </button>
      </div>
    </div>
  );
}
