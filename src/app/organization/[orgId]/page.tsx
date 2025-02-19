"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProjectSpace } from "@/interfaces/workspace";
import { getData } from "@/services/baseRequest";

export default function Organization() {
  const router = useRouter();
  const { orgId } = useParams();
  const [projectSpaces, setProjectSpaces] = useState<ProjectSpace[]>([]);
  // const projectSpaces = [
  //   { name: "Project Space 1", date: "31 Feb 2099", time: "14:30" },
  //   { name: "Project Space 2", date: "31 Feb 2099", time: "10:00" },
  // ];
  const getProjectSpaces = async () => {
    const response = await getData(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/resources/children/${orgId}`
    );
    setProjectSpaces(response);
  };
  useEffect(() => {
    getProjectSpaces();
  }, []);
  return (
    <div>
      <div className="flex flex-row justify-between">
        <h1 className="font-bold text-[24px]">Project Spaces</h1>
        <button
          className="border border-ci-modal-grey px-6 py-1 bg-ci-modal-black rounded-md font-bold hover:bg-ci-modal-blue"
          onClick={() =>
            router.push(`/organization/${orgId}/new-project-space`)
          }
        >
          New Project Space
        </button>
      </div>
      {projectSpaces.length > 0 && (
        <div className="bg-ci-modal-black text-white rounded-lg w-full border border-ci-modal-grey mt-4">
          <div className="divide-y divide-ci-modal-grey">
            {projectSpaces.map((space, index) => (
              <div
                key={index}
                className="flex items-center p-4 transition cursor-pointer"
                onClick={() =>
                  router.push(`/project-space/${space.id}`)
                }
              >
                <Image
                  src={"/space-icon.svg"}
                  alt="space-icon"
                  width={24}
                  height={24}
                  className="mr-3"
                />
                <div className="grid grid-cols-2 w-full">
                  <div className="font-medium">{space.resource_name}</div>
                  {/* <div className="text-ci-modal-grey flex justify-end">
                  {space.date + ", " + space.time}
                </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
