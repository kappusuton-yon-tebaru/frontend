"use client";
import Image from "next/image";
import { useState } from "react";
import InputField from "@/app/components/InputField";

export default function CreateRole() {
  const [name, setName] = useState("");
  const permissions = [{ name: "Permission 1" }, { name: "Permission 2" }];
  return (
    <div>
      <div className="flex flex-row justify-between">
        <h1 className="font-bold text-[24px]">Create New Role</h1>
      </div>
      <div className="w-1/2 mt-12">
        <InputField
          label={"Role Name"}
          placeholder={"Role Name"}
          value={name}
          onChange={setName}
        />
      </div>
      <h2 className="font-bold mt-6">Role Permission</h2>
      <div className="bg-ci-modal-black text-white rounded-lg w-full border border-ci-modal-grey mt-4">
        <div className="divide-y divide-ci-modal-grey">
          {permissions.map((permission, index) => (
            <div
              key={index}
              className="flex items-center p-2 transition cursor-pointer"
            >
              <Image
                src={"/key-icon.svg"}
                alt="key-icon"
                width={24}
                height={24}
                className="mr-3"
              />
              <div className="grid grid-cols-2 w-full">
                <div className="font-medium flex items-center">
                  {permission.name}
                </div>
                <div className="text-ci-modal-grey flex justify-end space-x-4 items-center">
                  <button className="rounded-lg border border-ci-modal-grey px-8 py-2 text-white bg-ci-bg-dark-blue">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center mt-4 text-md font-bold cursor-pointer">
        <Image
          src={"/add-icon.svg"}
          alt="add-icon"
          width={24}
          height={24}
          className="mr-3"
        />
        Add new permission
      </div>
      <div className="right-4 absolute space-x-8 font-bold text-md py-8">
        <button className="rounded-lg border border-ci-modal-grey px-12 py-1 text-white bg-ci-modal-black">
          Save
        </button>
        <button className="rounded-lg border border-ci-modal-grey px-12 py-1 text-white bg-ci-modal-red">
          Cancel
        </button>
      </div>
    </div>
  );
}
