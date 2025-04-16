import { ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

export default function CustomModal({
    isOpen,
    onClose,
    title,
    children,
}: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-ci-modal-black text-white w-[500px] p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center border-b border-ci-modal-grey pb-3">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                <div className="mt-4">{children}</div>

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-ci-modal-grey bg-ci-modal-black text-white"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
