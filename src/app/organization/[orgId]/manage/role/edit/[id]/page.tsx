"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button, Checkbox } from "antd";
import InputField from "@/components/InputField";
import { getData } from "@/services/baseRequest";
import Image from "next/image";
import CustomModal from "@/components/Modal";
import toast from "react-hot-toast";
import axios from "axios";

export default function EditRole() {
    const [name, setName] = useState("");
    const { orgId, id } = useParams() as { orgId: string; id: string };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState<
        { action: string; resourceId: string; resourceName: string }[]
    >([]);
    const [selectedUsers, setSelectedUsers] = useState<
        { userId: string; name: string }[]
    >([]);
    const [loading, setLoading] = useState(false);

    const fetchResources = async () => {
        if (!orgId) return { organization: {}, projectSpaces: [] };
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/resources/${orgId}`;
        const childrenUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/resources/children/${orgId}?limit=1000`;
        const orgResponse = await getData(url);
        const projectSpacesResponse = await getData(childrenUrl);
        return {
            organization: orgResponse,
            projectSpaces: projectSpacesResponse.data,
        };
    };

    const fetchRoleData = async () => {
        try {
            const response = await getData(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/roles/${id}`
            );
            const permissions = response.permissions.map((perm: any) => ({
                action: perm.action,
                resourceId: perm.resource_id,
                resourceName: perm.permission_name,
            }));
            setName(response.role_name);
            setSelectedPermissions(permissions);
            return response;
        } catch (error) {
            toast.error("Failed to fetch role details.");
        }
    };

    const fetchUsers = async () => {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`;
        const response = await getData(url);
        return response;
    };

    const fetchUsersByRoleId = async () => {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/roles/${id}`;
        const response = await getData(url);
        const users = response.map((user: any) => ({
            userId: user.id,
            name: user.email,
        }));
        setSelectedUsers(users);

        return response;
    };

    const {
        data: resources,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["resources", orgId],
        queryFn: fetchResources,
        enabled: !!orgId,
    });

    const { data: role } = useQuery({
        queryKey: ["role", id],
        queryFn: fetchRoleData,
        enabled: !!id,
    });

    const { data: users } = useQuery({
        queryKey: ["users"],
        queryFn: fetchUsers,
    });

    const { data: role_users } = useQuery({
        queryKey: ["role_users"],
        queryFn: fetchUsersByRoleId,
    });

    const openModal = () => {
        setIsModalOpen(true);
    };

    const handleCheckboxChange = (
        resourceId: string,
        action: string,
        checked: boolean,
        resourceName: string
    ) => {
        setSelectedPermissions((prev) => {
            if (checked) {
                return [...prev, { action, resourceId, resourceName }];
            }
            return prev.filter(
                (perm) =>
                    !(perm.action === action && perm.resourceId === resourceId)
            );
        });
    };

    const handleUserCheckboxChange = (
        userId: string,
        name: string,
        checked: boolean
    ) => {
        setSelectedUsers((prev) =>
            checked
                ? [...prev, { userId, name }]
                : prev.filter((user) => user.userId !== userId)
        );
    };

    const onSubmit = async () => {
        if (!name.trim()) {
            toast.error("Role name is required.");
            return;
        }
        if (selectedPermissions.length === 0) {
            toast.error("Please select at least one permission.");
            return;
        }

        setLoading(true);

        const permissions = selectedPermissions.map((perm: any) => ({
            action: perm.action,
            resource_id: perm.resourceId,
            permission_name: perm.resourceName,
        }));

        const userIds = selectedUsers.map((user: any) => user.userId);

        try {
            const roleResponse = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/roles/${id}`,
                { role_name: name, permissions: permissions }
            );
            const usersResponse = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/roles/${id}`,
                { user_ids: userIds }
            );
            console.log(usersResponse);
            console.log(roleResponse);
            toast.success("Role and permissions saved successfully!");
            setName("");
            setSelectedPermissions([]);
            setSelectedUsers([]);
        } catch (error) {
            console.error("Error editing role:", error);
            toast.error("Failed to edit role.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex flex-row justify-between items-center">
                <h1 className="font-bold text-[24px]">Edit Role</h1>
                <div className="right-4 absolute space-x-8 font-bold text-md py-8">
                    <Button
                        className="rounded-lg border border-ci-modal-grey px-12 py-1 text-white bg-ci-modal-black"
                        loading={loading}
                        onClick={onSubmit}
                    >
                        Save
                    </Button>
                    <Button className="rounded-lg border border-ci-modal-grey px-12 py-1 text-white bg-ci-modal-red">
                        Cancel
                    </Button>
                </div>
            </div>
            <div className="w-1/2 mt-12">
                <InputField
                    label="Role Name"
                    placeholder="Role Name"
                    value={name}
                    onChange={setName}
                />
            </div>

            <h2 className="font-bold mt-6">Role Permissions</h2>
            {selectedPermissions.length > 0 && (
                <div className="bg-ci-modal-black text-white rounded-lg w-full border border-ci-modal-grey mt-4">
                    <div className="divide-y divide-ci-modal-grey">
                        {selectedPermissions.map((permission, index) => (
                            <div
                                key={index}
                                className="flex items-center p-3 transition cursor-pointer"
                            >
                                <Image
                                    src="/key-icon.svg"
                                    alt="key-icon"
                                    width={24}
                                    height={24}
                                    className="mr-3"
                                />
                                <div className="font-medium flex items-center">
                                    {permission.action.toUpperCase()} -{" "}
                                    {permission.resourceName}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div
                className="flex justify-center items-center mt-4 text-md font-bold cursor-pointer"
                onClick={openModal}
            >
                <Image
                    src="/add-icon.svg"
                    alt="add-icon"
                    width={24}
                    height={24}
                    className="mr-3"
                />
                Add new permission
            </div>

            <h2 className="font-bold mt-6">Assigned Users</h2>
            {selectedUsers.length > 0 && (
                <div className="bg-ci-modal-black text-white rounded-lg w-full border border-ci-modal-grey mt-4">
                    <div className="divide-y divide-ci-modal-grey">
                        {selectedUsers.map((user, index) => (
                            <div
                                key={index}
                                className="flex items-center p-3 transition cursor-pointer"
                            >
                                <Image
                                    src="/use-group-icon.svg"
                                    alt="user-icon"
                                    width={24}
                                    height={24}
                                    className="mr-3"
                                />
                                <div className="font-medium flex items-center">
                                    {user.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div
                className="flex justify-center items-center mt-4 text-md font-bold cursor-pointer"
                onClick={() => setIsUserModalOpen(true)}
            >
                <Image
                    src="/add-icon.svg"
                    alt="add-icon"
                    width={24}
                    height={24}
                    className="mr-3"
                />
                Assign role to users
            </div>
            <CustomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Select Resources"
            >
                {resources?.organization && <div className="flex flex-col space-y-4 bg-ci-modal-black">
                    <div
                        key={resources?.organization.id}
                        className="flex justify-between items-center p-2 border border-ci-modal-grey rounded-md bg-ci-modal-black"
                    >
                        <span>
                            {resources?.organization.resource_name}{" "}
                            (Organization)
                        </span>
                        <div className="flex space-x-4">
                            <Checkbox
                                onChange={(e) =>
                                    handleCheckboxChange(
                                        resources?.organization.id,
                                        "read",
                                        e.target.checked,
                                        resources?.organization.resource_name
                                    )
                                }
                                checked={selectedPermissions.some(
                                    (perm) =>
                                        perm.resourceId ===
                                            resources?.organization.id &&
                                        perm.action === "read"
                                )}
                            >
                                Read
                            </Checkbox>
                            <Checkbox
                                onChange={(e) =>
                                    handleCheckboxChange(
                                        resources?.organization.id,
                                        "write",
                                        e.target.checked,
                                        resources?.organization.resource_name
                                    )
                                }
                                checked={selectedPermissions.some(
                                    (perm) =>
                                        perm.resourceId ===
                                            resources?.organization.id &&
                                        perm.action === "write"
                                )}
                            >
                                Write
                            </Checkbox>
                        </div>
                    </div>
                    {resources?.projectSpaces?.map((resource: any) => (
                        <div
                            key={resource.id}
                            className="flex justify-between items-center p-2 border border-ci-modal-grey rounded-md bg-ci-modal-black"
                        >
                            <span>{resource.resource_name}</span>
                            <div className="flex space-x-4">
                                <Checkbox
                                    onChange={(e) =>
                                        handleCheckboxChange(
                                            resource.id,
                                            "read",
                                            e.target.checked,
                                            resource.resource_name
                                        )
                                    }
                                    checked={selectedPermissions.some(
                                        (perm) =>
                                            perm.resourceId === resource.id &&
                                            perm.action === "read"
                                    )}
                                >
                                    Read
                                </Checkbox>
                                <Checkbox
                                    onChange={(e) =>
                                        handleCheckboxChange(
                                            resource.id,
                                            "write",
                                            e.target.checked,
                                            resource.resource_name
                                        )
                                    }
                                    checked={selectedPermissions.some(
                                        (perm) =>
                                            perm.resourceId === resource.id &&
                                            perm.action === "write"
                                    )}
                                >
                                    Write
                                </Checkbox>
                            </div>
                        </div>
                    ))}
                </div>}
            </CustomModal>
            <CustomModal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                title="Select Users"
            >
                <div className="flex flex-col space-y-4 bg-ci-modal-black p-4 rounded-md">
                    {users?.map((user: any) => (
                        <div
                            key={user.id}
                            className="flex justify-between items-center p-2 border border-ci-modal-grey rounded-md"
                        >
                            <span>{user.email}</span>
                            <Checkbox
                                onChange={(e) =>
                                    handleUserCheckboxChange(
                                        user.id,
                                        user.email,
                                        e.target.checked
                                    )
                                }
                                checked={selectedUsers.some(
                                    (selectedUser) =>
                                        selectedUser.userId === user.id
                                )}
                            />
                        </div>
                    ))}
                </div>
            </CustomModal>
        </div>
    );
}
