"use client";
import { useToken } from "@/context/TokenContext";
import { useCommitMetadata } from "@/hooks/github";
import { Content } from "@/interfaces/github";
import { Spin } from "antd";
import Image from "next/image";

export default function RepoItem({
  item,
  owner,
  repo,
  currentBranch,
}: {
  item: Content;
  owner: string;
  repo: string;
  currentBranch: string;
}) {
  const { tokenAuth } = useToken();
  const { data: commitInfo, isLoading } = useCommitMetadata(
    owner,
    repo,
    tokenAuth,
    item.path,
    currentBranch
  );
  if (isLoading || currentBranch === "" || !currentBranch) return <Spin />;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    const hours = date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${day} ${month} ${year} ${hours}`;
  };

  return (
    <div key={item.path} className="flex items-center p-4 cursor-pointer">
      <div className="grid grid-cols-[35%_48%_27%] w-full">
        <div className="font-medium flex flex-row items-center">
          <Image
            src={
              item.download_url === "" ? "/folder-icon.svg" : "/file-icon.svg"
            }
            alt={item.download_url === "" ? "Folder" : "File"}
            width={24}
            height={24}
            className="mr-3"
          />
          {item.name}
        </div>
        <div className="flex text-ci-modal-grey items-center">
          {commitInfo ? commitInfo.commitMessage : <Spin />}
        </div>
        <div className="flex text-ci-modal-grey items-center">
          {commitInfo ? formatDate(commitInfo.lastEditTime) : <Spin />}
        </div>
      </div>
    </div>
  );
}
