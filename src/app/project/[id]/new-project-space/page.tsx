"use client";

import InputField from "@/app/components/InputField";
import { useState } from "react";

export default function NewProjectSpace() {
  const [name, setName] = useState<string>("");

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
        <button className="text-ci-modal-white text-base font-bold border-ci-modal-grey border w-36 rounded-md px-3 py-2 bg-ci-modal-black hover:bg-ci-modal-blue">
          Create
        </button>
      </div>
    </div>
  );
}
