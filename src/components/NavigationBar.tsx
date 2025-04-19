"use client";

import Image from "next/image";
import OrganizationButton from "./OrganizationButton";
import { getData } from "@/services/baseRequest";
import { useState, useEffect } from "react";
import { Resource } from "@/interfaces/workspace";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function NavigationBar() {
  const { orgId } = useParams();
  if (typeof orgId !== "undefined") {
  }
  const temp: Resource = {
    id: "0",
    resource_name: "Organization",
    resource_type: "ORGANIZATION",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const [organizations, setOrganizations] = useState<Resource[]>([]);
  const [selectedOrganization, setSelectedOrganization] =
    useState<Resource>(temp);

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

  useEffect(() => {
    if (typeof orgId !== "undefined") {
      const selectedOrg = organizations.find((org) => org.id === orgId);
      if (selectedOrg) {
        setSelectedOrganization(selectedOrg);
      }
    } else {
      setSelectedOrganization(temp);
    }
  }, [organizations, orgId]);

  return (
    <div className="flex flex-row h-16 bg-[#081126] fixed top-0 left-0 right-0 z-40 items-center px-9 justify-between font-bold">
      <div className="flex flex-row gap-x-12 items-center h-12">
        <Image src={"/logo.svg"} alt="logo" width={44} height={44} />
        <div>
          <Link href={"/"}>Project</Link>
        </div>
        <div>
          <Link href={"/cicd"}>Image and Deployment</Link>
        </div>
      </div>
      <div className="flex flex-row gap-x-12 items-center">
        {selectedOrganization && (
          <OrganizationButton
            organization={organizations}
            selectedOrganization={selectedOrganization}
            setSelectedOrganization={setSelectedOrganization}
          />
        )}
        <div className="bg-[#D9D9D9] rounded-full w-12 h-12 flex items-center justify-center">
          <Image src="/user_icon.svg" alt="user_icon" width={44} height={44} />
        </div>
      </div>
    </div>
  );
}
