"use client";

import { useRouter } from "next/navigation";

export interface ModalProps {
  title: string;
  description: string;
  actionFunction?: any;
  setIsOpen: any;
  buttonActionTitle?: string;
}

export default function Modal({
  title,
  description,
  actionFunction,
  setIsOpen,
  buttonActionTitle,
}: ModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="p-8 border w-234 shadow-lg rounded-md bg-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-lg text-gray-500">{description}</p>
          </div>
          <div className="flex justify-around mt-4">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Close
            </button>
            <button
              className="px-4 py-2 bg-ci-modal-red text-white text-base font-medium rounded-md shadow-sm hover:bg-ci-status-red focus:outline-none focus:ring-2 focus:ring-gray-300"
              onClick={() => {
                actionFunction();
                setIsOpen(false);
              }}
            >
              {buttonActionTitle}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
