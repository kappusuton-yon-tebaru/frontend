"use client";

import InputField from "@/app/components/InputField";
import RadioSelection from "@/app/components/RadioSelection";
import { useState } from "react";
import { Check } from "lucide-react";

export default function NewRepository() {
  const [name, setName] = useState<string>("");
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
  const [type, setType] = useState<string>(options[0].value);
  const [readme, setReadme] = useState<boolean>(false);

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
        <RadioSelection
          options={options}
          selectedOption={type}
          onChange={setType}
        />
        <hr className="w-3/5 border-ci-modal-grey my-8" />
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => {
            setReadme(!readme);
          }}
        >
          {readme ? (
            <Check
              size={20}
              className="text-ci-modal-light-blue bg-ci-modal-white border border-4 border-ci-modal-light-blue rounded-sm"
            />
          ) : (
            <div className="w-5 h-5 border border-2 rounded-sm flex justify-center items-center border-gray-400"></div>
          )}

          <span className="text-ci-modal-white">Add a README file</span>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button className="text-ci-modal-white text-base font-bold border-ci-modal-grey border w-36 rounded-md px-3 py-2 bg-ci-modal-black hover:bg-ci-modal-blue">
          Create
        </button>
      </div>
    </div>
  );
}
