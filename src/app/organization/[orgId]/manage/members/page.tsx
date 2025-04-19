"use client";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useResource } from "@/hooks/workspace";
import Image from "next/image";
import { getData } from "@/services/baseRequest";
import { useQuery } from "@tanstack/react-query";
import { Button } from "antd";
import DeleteUserPopup from "@/components/DeleteUserPopup";
import AddMemberPopup from "@/components/AddMemberPopup";

export default function ManageMembersPage() {
    const { orgId } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const deleteModalRef = useRef<HTMLDivElement>(null);
    const addMemberModalRef = useRef<HTMLDivElement>(null);

    if (typeof orgId === "undefined" || Array.isArray(orgId)) {
        throw new Error("Invalid orgId");
    }
    const { data: organization } = useResource(orgId);
    const [name, setName] = useState("");
    const [search, setSearch] = useState("");
    const [currentEmail, setCurrentEmail] = useState("");

    const fetchUsers = async () => {
        const url = new URL(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/resources/${orgId}/members/search`
        );
        if (search) {
            url.searchParams.append("query", search);
        }

        const response = await getData(url.toString());
        return response;
    };

    const { data: users } = useQuery({
        queryKey: ["users", search],
        queryFn: fetchUsers,
    });

    useEffect(() => {
        if (organization && organization.resource_name) {
            setName(organization.resource_name);
        }
    }, [organization]);

    return (
        <div className="flex flex-col gap-8">
            <h1 className="font-bold text-[24px]">{name} - Members</h1>
            <div className="flex items-center border p-2 rounded-md border-ci-modal-grey bg-ci-modal-black flex-grow h-full">
                <Image
                    src="/search-icon.svg"
                    alt="search-icon"
                    width={20}
                    height={20}
                    className="mr-2"
                />
                <input
                    type="text"
                    placeholder="Find a member..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value.toLowerCase())}
                    className="flex-grow bg-transparent text-white outline-none h-full"
                />
            </div>
            <hr className="mx-[-20px] border-ci-modal-grey"></hr>
            {users && users.length > 0 && (
                <div className="bg-ci-modal-black text-white rounded-lg w-full border border-ci-modal-grey">
                    <div className="divide-y divide-ci-modal-grey">
                        {users.map((user: any, index: any) => (
                            <div
                                key={index}
                                className="flex items-center p-3 transition cursor-pointer justify-between"
                            >
                                <div className="flex gap-2">
                                    <Image
                                        src="/use-group-icon.svg"
                                        alt="user-icon"
                                        width={24}
                                        height={24}
                                        className="mr-3"
                                    />
                                    <div className="font-medium flex items-center">
                                        {user}
                                    </div>
                                </div>
                                <Button
                                    className="px-4 py-2 text-white font-semibold bg-ci-modal-red rounded-md"
                                    onClick={() => {
                                        setIsDeleteModalOpen(true)
                                        setCurrentEmail(user)
                                    }}
                                >
                                    Delete
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div
                className="flex justify-center items-center text-md font-bold cursor-pointer"
                onClick={() => setIsModalOpen(true)}
            >
                <Image
                    src="/add-icon.svg"
                    alt="add-icon"
                    width={24}
                    height={24}
                    className="mr-3"
                />
                Add new member
            </div>
            {isModalOpen && (
                <AddMemberPopup
                    addMemberModalRef={addMemberModalRef}
                    setOpen={setIsModalOpen}
                    orgId={orgId}
                />
            )}
            {isDeleteModalOpen && (
                <DeleteUserPopup
                    deleteModalRef={deleteModalRef}
                    setDel={setIsDeleteModalOpen}
                    email={currentEmail}
                    orgId={orgId}
                    orgName={name}
                />
            )}
        </div>
    );
}
