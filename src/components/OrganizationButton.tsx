"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import OrganizationSelection from "./OrganizationSelection";
import { Resource } from "@/interfaces/workspace";

export default function OrganizationButton({
  organization,
  selectedOrganization,
  setSelectedOrganization,
}: {
  organization: Resource[];
  selectedOrganization: Resource;
  setSelectedOrganization: (org: Resource) => void;
}) {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpened(false);
      }
    }
    if (isOpened) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpened]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="bg-ci-bg-dark-blue py-3 pl-4 pr-6 rounded-md grid grid-cols-[25px_80px] gap-2 grid justify-center min-w-36"
        onClick={() => {
          setIsOpened(!isOpened);
        }}
      >
        <div>{isOpened ? <ChevronUp /> : <ChevronDown />} </div>
        <div className="truncate">{selectedOrganization.resource_name}</div>
      </button>
      {isOpened && (
        <OrganizationSelection
          organization={organization}
          setSelectedOrganization={setSelectedOrganization}
          onClose={() => {
            setIsOpened(false);
          }}
        />
      )}
    </div>
  );
}
