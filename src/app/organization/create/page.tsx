"use client";
import InputField from "@/app/components/InputField";
import { useState } from "react";

export default function CreateOrganiazation() {
  const [name, setName] = useState("");
  return (
    <div className="">
      <h1 className="font-bold text-[24px]">Create Organization</h1>
      <div className="w-1/2 mt-12">
        <InputField
          label={"Organization Name"}
          placeholder={"Organization Name"}
          value={name}
          onChange={setName}
        />
      </div>
      <button className="absolute border border-ci-modal-grey px-16 py-1 bg-ci-modal-black rounded-md font-bold bottom-12 right-12">
        Create
      </button>
    </div>
  );
}
