"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import OrganizationSelection from "./OrganizationSelection";

export default function OrganizationButton({
  organization,
}: {
  organization: string[];
}) {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [selectedOrganization, setSelectedOrganization] = useState<string>(
    organization[0]
  );
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
        className="bg-ci-bg-dark-blue py-3 pl-4 pr-6 rounded-md flex flex-row gap-2"
        onClick={() => {
          setIsOpened(!isOpened);
        }}
      >
        {isOpened ? <ChevronUp /> : <ChevronDown />} {selectedOrganization}
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
