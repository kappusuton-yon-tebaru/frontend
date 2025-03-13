import { useState, useRef, useEffect } from "react";
import { Button } from "antd";

const options = ["Name", "Last Updated", "Date Created"];

export default function SortButton() {
  const [selectedOption, setSelectedOption] = useState<string>("Name");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block h-full">
      <Button
        ref={buttonRef}
        className="h-full w-60 text-[18px] border border-ci-modal-grey px-6 py-1 bg-ci-modal-black rounded-md font-medium hover:bg-ci-modal-blue transition-all duration-300 ease-in-out"
        onClick={toggleDropdown}
      >
        <div className="text-ci-modal-grey">Sort by: </div>
        <div className="ml-1 text-white">{selectedOption || "(option)"}</div>
      </Button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-0 mt-2 w-full bg-ci-bg-dark-blue border border-ci-modal-grey rounded-md shadow-lg z-10"
        >
          {options.map((option, index) => (
            <button
              key={option}
              className={`block w-full text-left px-4 py-2 text-white font-medium hover:bg-ci-modal-blue ${
                index === 0 ? "hover:rounded-t-md" : ""
              } ${index === options.length - 1 ? "hover:rounded-b-md" : ""}`}
              onClick={() => {
                setSelectedOption(option);
                setIsOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
