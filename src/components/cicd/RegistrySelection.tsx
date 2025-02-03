"use client";

import { useState } from "react";

const options = [
  { label: "ECR", icon: "🟧" },
  { label: "Docker Hub", icon: "🐳" },
];

export default function RegistrySelector({
  onSelect,
}: {
  onSelect: (label: string) => void;
}) {
  const [selected, setSelected] = useState(options[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: { label: string; icon: string }) => {
    setSelected(option);
    setIsOpen(false);
    onSelect(option.label); // Notify parent component
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 bg-ci-modal-black hover:bg-ci-modal border border-ci-modal-grey rounded-lg text-base"
      >
        <span className="flex items-center">
          <span className="mr-2">{selected.icon}</span> {selected.label}
        </span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <ul className="absolute left-0 w-full mt-1 bg-ci-modal-black rounded-lg shadow-lg">
          {options.map((option) => (
            <li
              key={option.label}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 cursor-pointer hover:bg-ci-modal-blue rounded-lg"
            >
              <span className="mr-2">{option.icon}</span> {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
