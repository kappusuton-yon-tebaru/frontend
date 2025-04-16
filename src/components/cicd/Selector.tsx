"use client";

import { Dispatch, SetStateAction, useState } from "react";

export interface SelectorOption {
  label: string;
  icon?: string;
  id: string;
  type?: string;
  data?: any;
}

export default function Selector({
  options,
  initialOption,
  onSelect,
  isMultiSelect = false,
}: {
  options?: SelectorOption[];
  initialOption?: SelectorOption[] | SelectorOption | null;
  onSelect: Dispatch<SetStateAction<any>>;
  isMultiSelect?: boolean;
}) {
  const initialSet = new Set(
    Array.isArray(initialOption)
      ? initialOption
      : initialOption
      ? [initialOption]
      : []
  );

  const [selected, setSelected] = useState<Set<SelectorOption>>(initialSet);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: SelectorOption) => {
    const newSelected = new Set(selected);

    if (isMultiSelect) {
      if (newSelected.has(option)) {
        newSelected.delete(option);
      } else {
        newSelected.add(option);
      }
    } else {
      newSelected.clear();
      newSelected.add(option);
      setIsOpen(false);
    }

    setSelected(newSelected);
    onSelect(
      isMultiSelect ? Array.from(newSelected) : Array.from(newSelected)[0]
    );
  };

  const handleRemove = (option: SelectorOption) => {
    const newSelected = new Set(selected);
    newSelected.delete(option);
    setSelected(newSelected);
    onSelect(Array.from(newSelected));
  };

  return (
    <div className="relative w-full">
      {isMultiSelect ? (
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-wrap items-center gap-2 w-full px-3 py-2 bg-ci-modal-black border border-ci-modal-grey rounded-lg text-base cursor-pointer min-h-[40px] z-1"
        >
          {selected.size > 0 ? (
            Array.from(selected).map((opt) => (
              <span
                key={opt.label}
                className="flex items-center px-3 py-1 bg-gray-300 text-black rounded-lg text-sm"
              >
                {opt.icon && <span className="mr-1">{opt.icon}</span>}
                {opt.label}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(opt);
                  }}
                  className="ml-2 text-black hover:text-gray-700"
                >
                  ✖
                </button>
              </span>
            ))
          ) : (
            <span>Select an option</span>
          )}
          <span className="ml-auto">{isOpen ? "▲" : "▼"}</span>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-2 bg-ci-modal-black hover:bg-ci-modal border border-ci-modal-grey rounded-lg text-base"
        >
          <span className="flex items-center">
            {Array.from(selected)[0]?.icon && (
              <span className="mr-2">{Array.from(selected)[0].icon}</span>
            )}
            {Array.from(selected)[0]?.label || "Select an option"}
          </span>
          <span>{isOpen ? "▲" : "▼"}</span>
        </button>
      )}

      {isOpen && options && (
        <ul className="absolute left-0 w-full mt-1 bg-ci-modal-black rounded-lg shadow-lg overflow-y-auto max-h-60">
          {options.map((option) => (
            <li
              key={option.id || option.label}
              onClick={() => handleSelect(option)}
              className={`px-4 py-2 cursor-pointer hover:bg-ci-modal-blue rounded-lg flex items-center truncate z-auto ${
                selected.has(option) ? "bg-ci-modal-blue" : ""
              }`}
            >
              {option.icon && <span className="mr-2">{option.icon}</span>}
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
