"use client";
import InputField from "@/components/cicd/InputField";
import { useToast } from "@/context/ToastContext";
import { deleteData } from "@/services/baseRequest";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ServicePage() {
  const { projectSpaceId, projectId, envId, serviceId } = useParams();
  const { triggerToast } = useToast();

  const organizationId = "678fcf897c67bca50cfae34e";
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const router = useRouter();

  const endpoints = {
    deleteDeployment: `${baseUrl}/project/${projectId}/deploy`,
  };

  const [textDelete, setTextDelete] = useState("");

  const handleCanDelete = (value: string) => {
    if (value === "delete") {
      return true;
    }
    return false;
  };

  const handleDelete = async () => {
    try {
      const deletePayload = {
        deployment_env: envId,
        service_name: serviceId,
      };
      const response = await deleteData(
        endpoints.deleteDeployment,
        deletePayload
      );
      triggerToast("Delete deployment success!", "success");
      router.push(
        `/cicd/deployment/environment/${projectSpaceId}/projects/${projectId}/services/${envId}`
      );
    } catch (error) {
      triggerToast(`Delete deployment failed.\n${error}`, "error");
    }
  };
  return (
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-8">
      <div className="grid grid-cols-6 gap-x-12 gap-y-10">
        <h2 className="text-xl font-bold col-span-6">Delete Deployment</h2>
        <div className="col-span-6">
          <InputField
            label="Confirmation"
            placeholder="Type `delete` to start deleting this deployment"
            value={textDelete}
            onChange={(value) => setTextDelete(value)}
          />
        </div>
        <div className="col-start-6">
          <button
            className={`bg-ci-modal-red border border-ci-modal-grey py-2 rounded-lg text-base w-full ${
              !handleCanDelete(textDelete)
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-ci-status-red"
            }`}
            onClick={handleDelete}
            disabled={!handleCanDelete(textDelete)}
          >
            Delete
          </button>
        </div>
        <hr className="border-t border-gray-300 col-span-6" />
      </div>
    </div>
  );
}
