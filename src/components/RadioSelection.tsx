import { useState } from "react";

interface RadioSelectionProps {
  options: { label: string; value: string; description?: string }[];
  selectedOption: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function RadioSelection({
  options,
  selectedOption,
  onChange,
  label,
}: RadioSelectionProps) {
  return (
    <div className="flex flex-col gap-4">
      {label && <label className="font-bold text-[18px]">{label}</label>}
      <div className="flex flex-col gap-4">
        {options.map((option) => (
          <label key={option.value} className="flex flex-col cursor-pointer">
            <div className="flex items-center gap-4">
              <input
                type="radio"
                name="options"
                value={option.value}
                checked={selectedOption === option.value}
                onChange={() => onChange(option.value)}
                className="hidden"
              />
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  selectedOption === option.value
                    ? "bg-ci-modal-white border-4 border-ci-modal-light-blue"
                    : "bg-transparent border-2 border-ci-modal-grey"
                }`}
              >
                {selectedOption === option.value && (
                  <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                )}
              </div>
              <span className="text-ci-modal-white">{option.label}</span>
              {option.description && (
                <span className="absolute text-ci-modal-grey text-sm pl-28">
                  {option.description}
                </span>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
