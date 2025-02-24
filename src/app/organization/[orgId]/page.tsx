"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Resource } from "@/interfaces/workspace";
import { getData } from "@/services/baseRequest";
import ProjectSpaceButton from "@/components/ProjectSpaceButton";
import CustomPagination from "@/components/CustomPagination";
import { Pagination } from "antd";

export default function Organization() {
  const router = useRouter();
  const { orgId } = useParams();
  const [organization, setOrganization] = useState<Resource>();
  const [projectSpaces, setProjectSpaces] = useState<Resource[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 2
  const getOrganizationName = async () => {
    const response = await getData(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/resources/${orgId}`
    );
    setOrganization(response);
  };

  const getProjectSpaces = async (page: number) => {
    const response = await getData(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/resources/children/${orgId}?page=${page}&limit=2`
    );
    setProjectSpaces(response.data);
    setTotal(response.total)
  };

  const onPageChange = (page: number) => {
    setPage(page);
    getProjectSpaces(page);
  }

  useEffect(() => {
    getProjectSpaces(1);
    getOrganizationName();
  }, []);

  return (
    <div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <h1 className="font-bold text-[24px]">
            {organization?.resource_name}
          </h1>
          <h2 className="font-medium text-[16px] text-ci-modal-grey">
            Owner: user 1
          </h2>
        </div>
        <div className="flex gap-8 my-2">
          <button
            className="border border-ci-modal-grey px-6 py-1 bg-ci-modal-black rounded-md font-bold hover:bg-ci-modal-blue"
            onClick={() => router.push(`/organization/${orgId}/manage`)}
          >
            Manage Organization
          </button>
          <button
            className="border border-ci-modal-grey px-6 py-1 bg-ci-modal-black rounded-md font-bold hover:bg-ci-modal-blue"
            onClick={() =>
              router.push(`/organization/${orgId}/new-project-space`)
            }
          >
            New Project Space
          </button>
        </div>
      </div>
      <hr className="my-6 mx-[-20px] border-ci-modal-grey"></hr>
      {projectSpaces.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {projectSpaces.map((space, index) => (
            <div
              key={index}
              onClick={() =>
                router.push(`/organization/${orgId}/project-space/${space.id}`)
              }
              className="cursor-pointer"
            >
              <ProjectSpaceButton projectSpace={space} />
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 flex justify-center w-full">
        <CustomPagination total={total} pageSize={pageSize} onPageChange={onPageChange} />
      </div>
    </div>
  );
}
