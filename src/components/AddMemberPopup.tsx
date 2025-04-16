"use client";
import { deleteData } from "@/services/baseRequest";
import { Dispatch, RefObject, SetStateAction } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import Input from "antd/es/input/Input";
import { postData } from "@/services/baseRequest";

export default function AddMemberPopup({
    addMemberModalRef,
    setOpen,
    orgId,
}: {
    addMemberModalRef: RefObject<HTMLDivElement | null>;
    setOpen: Dispatch<SetStateAction<boolean>>;
    orgId: string;
}) {
    const [email, setEmail] = useState("");
    const handleSubmit = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }
        try {
            const operation = postData(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/resources/${orgId}/members`,
                { email: email }
            );
            window.location.reload();
            toast.success("User added successfully");
            setOpen(false);
        } catch (e: any) {
            const errorMessage =
                e?.response?.data?.message ||
                e?.message ||
                "Something went wrong.";
            toast.error(errorMessage);
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-default z-30"
            onClick={(e) => e.stopPropagation()}
        >
            <div
                className="flex flex-col bg-ci-modal-dark-blue p-6 rounded-md shadow-lg w-[700px] h-[400px] gap-8 justify-center"
                ref={addMemberModalRef}
            >
                <div className="flex text-4xl font-bold text-ci-modal-white mb-3 justify-center">
                    Add Member to Organization
                </div>
                <Input
                    className="px-4 h-12 focus:bg-ci-modal-blue active:bg-ci-modal-blue hover:bg-ci-modal-blue text-white bg-ci-bg-dark-blue placeholder:text-ci-modal-grey border-ci-modal-grey"
                    placeholder="Enter email address"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="flex mx-16 mt-4 gap-8">
                    <button
                        className="px-4 py-2 text-white font-semibold bg-ci-bg-dark-blue rounded-md w-full"
                        onClick={() => {
                            handleSubmit();
                        }}
                    >
                        Confirm
                    </button>
                    <button
                        className="px-4 py-2 text-white font-semibold bg-ci-modal-red rounded-md w-full"
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>

            <Toaster
                position="bottom-right"
                toastOptions={{
                    success: {
                        style: {
                            background: "#4CAF50",
                            color: "white",
                        },
                    },
                    error: {
                        style: {
                            background: "#F44336",
                            color: "white",
                        },
                    },
                }}
            />
        </div>
    );
}
