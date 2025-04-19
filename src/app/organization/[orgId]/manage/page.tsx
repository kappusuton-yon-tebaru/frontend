"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import InputField from "@/components/InputField";
import { useResource } from "@/hooks/workspace";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/services/baseRequest";
import { Button } from "antd";
import Link from "next/link";

export default function ManageOrganization() {
    const { orgId } = useParams();

    if (typeof orgId === "undefined" || Array.isArray(orgId)) {
        throw new Error("Invalid orgId");
    }
    const { data: organization } = useResource(orgId);
    const [name, setName] = useState("");

    useEffect(() => {
        if (organization && organization.resource_name) {
            setName(organization.resource_name);
        }
    }, [organization]);

    const fetchRoles = async () => {
        try {
            const response = await getData(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/resources/${orgId}/roles`
            );
            console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    };

    const {
        data: roles,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["roles", orgId],
        queryFn: fetchRoles,
        enabled: !!orgId,
    });

    return (
        <div>
            <div className="flex justify-between">
                <h1 className="font-bold text-[24px]">Manage Organization</h1>
                <div className="flex gap-2">
                    <Link href="manage/members">
                        <Button className="rounded-lg border border-ci-modal-grey px-12 py-1 text-white bg-ci-modal-black">
                            Manage Members
                        </Button>
                    </Link>
                    <Button className="rounded-lg border border-ci-modal-grey px-12 py-1 text-white bg-ci-modal-black">
                        Save
                    </Button>
                </div>
            </div>

            <div className="w-1/2 mt-12">
                <InputField
                    label={"Organization Name"}
                    placeholder={"Organization Name"}
                    value={name}
                    onChange={setName}
                />
            </div>
            <h2 className="font-bold mt-6">Role</h2>
            <div className="bg-ci-modal-black text-white rounded-lg w-full border border-ci-modal-grey mt-4">
                {roles && (
                    <div className="divide-y divide-ci-modal-grey">
                        {roles.map((role: any, index: any) => (
                            <div
                                key={index}
                                className="flex items-center p-2 transition cursor-pointer"
                            >
                                <Image
                                    src={"/key-icon.svg"}
                                    alt="key-icon"
                                    width={24}
                                    height={24}
                                    className="mr-3"
                                />
                                <div className="grid grid-cols-2 w-full">
                                    <div className="font-medium flex items-center">
                                        {role.role_name}
                                    </div>
                                    <div className="text-ci-modal-grey flex justify-end space-x-4 items-center">
                                        <Link
                                            href={`manage/role/edit/${role.id}`}
                                        >
                                            <Button className="rounded-lg border border-ci-modal-grey px-8 py-2 text-white bg-ci-bg-dark-blue">
                                                Edit
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Link href={`manage/role/create`}>
                <div className="flex justify-center items-center mt-4 text-md font-bold cursor-pointer">
                    <Image
                        src={"/add-icon.svg"}
                        alt="add-icon"
                        width={24}
                        height={24}
                        className="mr-3"
                    />
                    Add new role
                </div>
            </Link>
        </div>
    );
}
