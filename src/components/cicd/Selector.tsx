"use client";

import { useState } from "react";

export interface SelectorOption {
  label: string;
  icon?: string;
  id?: string;
  type?: string;
}

export default function Selector({
  options,
  initialOption,
  onSelect,
}: {
  options: SelectorOption[];
  initialOption: SelectorOption | null;
  onSelect: (option: SelectorOption) => void;
}) {
  const [selected, setSelected] = useState<SelectorOption | null>(
    initialOption
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: SelectorOption) => {
    setSelected(option);
    setIsOpen(false);
    onSelect(option);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 bg-ci-modal-black hover:bg-ci-modal border border-ci-modal-grey rounded-lg text-base"
      >
        <span className="flex items-center">
          {selected?.icon && <span className="mr-2">{selected.icon}</span>}
          {selected?.label}
        </span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <ul className="absolute left-0 w-full z-30 mt-1 bg-ci-modal-black rounded-lg shadow-lg">
          {options.map((option) => (
            <li
              key={option.label}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 cursor-pointer hover:bg-ci-modal-blue rounded-lg"
            >
              {option.icon ? <span className="mr-2">{option.icon}</span> : null}
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
