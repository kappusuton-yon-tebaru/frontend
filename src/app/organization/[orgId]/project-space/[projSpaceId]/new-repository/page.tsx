"use client";

import InputField from "@/components/InputField";
import RadioSelection from "@/components/RadioSelection";
import { useToken } from "@/context/TokenContext";
import { checkGitHubRepoExists } from "@/hooks/github";
import { postData } from "@/services/baseRequest";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function NewRepository() {
  const router = useRouter();
  const { orgId, projSpaceId } = useParams();
  const { tokenAuth } = useToken();
  const [name, setName] = useState<string>("");
  const options = [
    {
      label: "Use existing GitHub repository",
      value: "exist",
    },
    {
      label: "Create new GitHub repository",
      value: "create",
    },
  ];
  const [type, setType] = useState<string>(options[0].value);
  const [gitRepoURL, setGitRepoURL] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const typeOptions = [
    {
      label: "Public",
      value: "public",
      description:
        "Anyone on the internet can see this repository. You choose who can commit.",
    },
    {
      label: "Private",
      value: "private",
      description: "You choose who can see and commit to this repository.",
    },
  ];
  const [repoType, setRepoType] = useState<string>(typeOptions[0].value);

  const onClickCreateButton = async () => {
    if (name !== "" && type === "create") {
      try {
        const response = await postData(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/github/create-repo/${projSpaceId}/resource`,
          {
            name: name,
            description: description,
            private: repoType === "private",
          },
          tokenAuth
        );
        router.push(`/organization/${orgId}/project-space/${projSpaceId}`);
        toast.success("Create new Repository successfully");
      } catch (e: any) {
        const errorMessage =
          e?.response?.data?.message || e?.message || "Something went wrong.";
        toast.error(errorMessage);
      }
    } else if (name !== "" && type === "exist") {
      try {
        if (!gitRepoURL.trim()) {
          toast.error("GitHub Repository is empty.");
          return;
        }

        const match = gitRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) {
          toast.error("Invalid GitHub repository URL.");
          return;
        }

        const owner = match[1];
        const repo = match[2];

        const isValidRepo = await checkGitHubRepoExists(owner, repo, tokenAuth);
        if (!isValidRepo) {
          toast.error("GitHub repository does not exist or is inaccessible.");
          return;
        }

        const repository = await postData(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/resources?parent_id=${projSpaceId}`,
          {
            resource_name: name,
            resource_type: "PROJECT",
          }
        );

        const gitRepository = await postData(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/projrepos/${repository.resourceId}`,
          {
            git_repo_url: gitRepoURL,
          }
        );
        router.push(`/organization/${orgId}/project-space/${projSpaceId}`);
        toast.success("Create new Repository successfully");
      } catch (e: any) {
        const errorMessage =
          e?.response?.data?.message || e?.message || "Something went wrong.";
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <h1 className="font-bold text-[24px]">Create Repository</h1>
      <div>
        <div className="w-1/2">
          <InputField
            label="Repository Name"
            placeholder="Repository Name"
            value={name}
            onChange={setName}
          />
        </div>
        <hr className="w-3/5 border-ci-modal-grey my-8" />
        <div className="w-1/2">
          <RadioSelection
            options={options}
            selectedOption={type}
            onChange={setType}
          />
        </div>
        <hr className="w-3/5 border-ci-modal-grey my-8" />
        <div className="w-1/2">
          {type == "create" ? (
            <div className="flex flex-col gap-y-6">
              <label className="text-base font-semibold">Description</label>
              <textarea
                className="px-4 py-2 bg-ci-modal-black hover:bg-ci-modal border border-ci-modal-grey rounded-lg text-base placeholder:text-sm resize-none h-20"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          ) : (
            <InputField
              label="GitHub repository URL"
              placeholder="e.g. https://github.com/user/repo (no .git at the end)"
              value={gitRepoURL}
              onChange={setGitRepoURL}
            />
          )}
        </div>
        {type == "create" && <hr className="w-3/5 border-ci-modal-grey my-8" />}
        {type == "create" && (
          <RadioSelection
            options={typeOptions}
            selectedOption={repoType}
            onChange={setRepoType}
          />
        )}
      </div>

      <div className="flex justify-end mt-8">
        <button
          className="text-ci-modal-white text-base font-bold border-ci-modal-grey border w-36 rounded-md px-3 py-2 bg-ci-modal-black hover:bg-ci-modal-blue"
          onClick={onClickCreateButton}
        >
          Create
        </button>
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
