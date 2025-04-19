"use client";
import EntityIndex from "@/components/cicd/EntityIndex";
import InputField from "@/components/cicd/InputField";
import PopupModal from "@/components/cicd/PopupModal";
import { ClipLoader } from "react-spinners";
import Selector from "@/components/cicd/Selector";
import { useToast } from "@/context/ToastContext";
import { deleteData, postData } from "@/services/baseRequest";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function DeploymentEnvironmentProjectPage() {
  const router = useRouter();
  const { projectSpaceId, projectId } = useParams();
  const { triggerToast } = useToast();

  const organizationId = "678fcf897c67bca50cfae34e";
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const searchUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${projectId}/deployenv?${organizationId}`;
  const endpoints = {
    createDeployEnv: `${baseUrl}/project/${projectId}/deployenv?org=${organizationId}`,
  };

  const [createEnvName, setCreateEnvName] = useState<string>("");
  const [deleteEnvName, setDeleteEnvName] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSaveSubmit = () => {
    try {
      const createPayload = {
        name: createEnvName,
      };
      const operation = postData(endpoints.createDeployEnv, createPayload);
      triggerToast("Add deployment environment success!", "success");
      window.location.reload();
    } catch (error) {
      triggerToast(`Add deployment environment failed.\n${error}`, "error");
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const deletePayload = {
        name: deleteEnvName,
      };
      const response = await deleteData(
        `${baseUrl}/project/${projectId}/deployenv?org=${organizationId}`,
        deletePayload
      );
      setIsLoading(false);
      triggerToast("Delete deployment environment success!", "success");
      setDeleteEnvName("");
      window.location.reload();
    } catch (error) {
      triggerToast(`Delete deployment failed.\n${error}`, "error");
    }
  };

  const renderEntity = (entity: any) => {
    return (
      <div
        className="flex flex-row px-6 py-3 gap-x-12 cursor-default select-none items-center"
        onClick={() =>
          router.push(
            `/cicd/deployment/environment/${projectSpaceId}/projects/${projectId}/services/${entity}`
          )
        }
      >
        <Image
          src={"/images/cicd/env.svg"}
          alt={"disk"}
          width={32}
          height={32}
        />
        <h3 className="text-base w-4/5">{entity}</h3>

        <Image
          src={"/images/cicd/delete.svg"}
          alt={"disk"}
          width={32}
          height={32}
          className="hover:bg-ci-modal-cyan-blue rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            setDeleteEnvName(entity);
            setIsOpen(true);
          }}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 pt-8 pb-16 flex flex-col gap-y-12">
      {isLoading && (
        <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-8 flex justify-center items-center">
          <ClipLoader
            size={100}
            color={"#245FA1"}
            cssOverride={{
              borderWidth: "10px",
            }}
            loading={isLoading}
          />
        </div>
      )}
      {isOpen && (
        <PopupModal
          title={"Delete Deployment Environment"}
          description={"Do you want to delete this environment?"}
          actionFunction={handleDelete}
          setIsOpen={setIsOpen}
          buttonActionTitle="Delete"
        />
      )}
      <EntityIndex
        topic={"Environment List"}
        description={`This is the list of all deployment environment from project ID: ${projectId}.`}
        searchUrl={searchUrl}
        renderEntity={renderEntity}
        queryKey="environment"
      />
      <hr className="border-t border-gray-300 col-span-6" />
      <div className="grid grid-cols-6 gap-x-12 gap-y-10">
        <h2 className="text-xl font-bold col-span-6">
          Add Deployment Environment
        </h2>
        <div className="col-span-6">
          <InputField
            label="Environment Name"
            placeholder="Environment Name"
            value={createEnvName}
            onChange={setCreateEnvName}
          />
        </div>
        <div className="col-start-6">
          <button
            className="bg-ci-modal-black hover:bg-ci-modal-blue border border-ci-modal-grey py-2 rounded-lg text-base w-full"
            onClick={() => {
              handleSaveSubmit();
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
