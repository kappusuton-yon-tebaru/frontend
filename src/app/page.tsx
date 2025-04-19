"use client";

import NavigationBar from "@/components/NavigationBar";
import Image from "next/image";
import SortManager from "@/components/SortManager";
import { useEffect, useState } from "react";
import { Resource } from "@/interfaces/workspace";
import { getData } from "@/services/baseRequest";
import OrganizationPageButton from "@/components/OrganizationPageButton";
import { Button, Pagination, Spin } from "antd";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState<string>("resource_name");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  const [organizations, setOrganizations] = useState<Resource[]>([]);

  const getOrganizations = async () => {
    const response = await getData(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/resources`
    );
    const res = response.filter(
      (item: Resource) => item.resource_type.toUpperCase() === "ORGANIZATION"
    );
    setOrganizations(res);
  };

  useEffect(() => {
    getOrganizations();
  }, []);

  return (
    <div>
      <NavigationBar />
      <div className="flex flex-col justify-center pt-14 items-center mx-36 px-8 gap-8 mb-4">
        <div className="font-bold text-3xl">Select an Organization</div>
        <div className="flex flex-row items-center gap-8 w-full h-10">
          <div className="flex items-center border p-2 rounded-md border-ci-modal-grey bg-ci-modal-black flex-grow h-full">
            <Image
              src="/search-icon.svg"
              alt="search-icon"
              width={20}
              height={20}
              className="mr-2"
            />
            <input
              type="text"
              placeholder="Find an Organization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              className="flex-grow bg-transparent text-white outline-none h-full"
            />
          </div>
          <SortManager
            sorting={sorting}
            setSorting={setSorting}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        </div>
      </div>
      <hr className="my-6 mx-40 border-ci-modal-grey"></hr>
      {organizations ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mx-36 px-8">
          {organizations?.map((organization: Resource, index: number) => (
            <div
              key={index}
              onClick={() => router.push(`/organization/${organization.id}`)}
              className="cursor-pointer"
            >
              <OrganizationPageButton organization={organization} />
            </div>
          ))}
        </div>
      ) : (
        <Spin />
      )}
      <hr className="my-6 mx-40 border-ci-modal-grey"></hr>
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="font-bold text-3xl">Or create a new Organization</div>
        <Button
          className="bg-ci-modal-light-blue border-ci-modal-light-blue text-white w-72 h-12 font-semibold text-lg"
          onClick={() => {
            router.push("/organization/create");
          }}
        >
          Create a new Organization
        </Button>
      </div>
    </div>
  );
}
