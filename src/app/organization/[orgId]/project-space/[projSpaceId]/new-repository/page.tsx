"use client";

import InputField from "@/components/InputField";
import RadioSelection from "@/components/RadioSelection";
import { postData } from "@/services/baseRequest";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function NewRepository() {
  const router = useRouter();
  const { orgId, projSpaceId } = useParams();
  const token = localStorage.getItem("access_token");
  let tokenAuth = "";
  if (token !== null) {
    tokenAuth = token;
  }
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const options = [
    {
      label: "Public",
      value: "public",
      description:
        "Anyone on the internet can see this repository. You choose who can commit.",
    },
    {
      label: "Private",
      value: "private",
      description: "You choose who can see and commit to this repository.",
    },
  ];
  const [repoType, setRepoType] = useState<string>(options[0].value);

  const onClickCreateButton = async () => {
    if (name !== "") {
      try {
        const response = await postData(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/github/create-repo/${projSpaceId}/resource`,
          {
            name: name,
            description: description,
            private: repoType === "private",
          },
          tokenAuth
        );
        router.push(`/organization/${orgId}/project-space/${projSpaceId}`);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <h1 className="font-bold text-[24px]">Create Repository</h1>
      <div>
        <div className="w-1/2">
          <InputField
            label="Repository Name"
            placeholder="Repository Name"
            value={name}
            onChange={setName}
          />
        </div>
        <hr className="w-3/5 border-ci-modal-grey my-8" />
        <div className="w-1/2">
          <div className="flex flex-col gap-y-6">
            <label className="text-base font-semibold">Description</label>
            <textarea
              className="px-4 py-2 bg-ci-modal-black hover:bg-ci-modal border border-ci-modal-grey rounded-lg text-base placeholder:text-sm resize-none h-20"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <hr className="w-3/5 border-ci-modal-grey my-8" />
        <RadioSelection
          options={options}
          selectedOption={repoType}
          onChange={setRepoType}
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
