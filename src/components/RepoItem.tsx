import { useCommitMetadata } from "@/hooks/github";
import { Content } from "@/interfaces/github";
import { Spin } from "antd";
import Image from "next/image";

export default function RepoItem({
  item,
  owner,
  repo,
  tokenAuth,
  currentBranch,
}: {
  item: Content;
  owner: string;
  repo: string;
  tokenAuth: string;
  currentBranch: string;
}) {
  const { data: commitInfo, isLoading } = useCommitMetadata(
    owner,
    repo,
    tokenAuth,
    item.path,
    currentBranch
  );
  if (isLoading || currentBranch === "" || !currentBranch) return <Spin />;

  return (
    <div key={item.path} className="flex items-center p-4 cursor-pointer">
      <div className="grid grid-cols-[40%_46%_14%] w-full">
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
        <div className="text-ci-modal-grey">
          {commitInfo ? commitInfo.commitMessage : "Loading..."}
        </div>
        <div className="text-ci-modal-grey">
          {commitInfo
            ? new Date(commitInfo.lastEditTime).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "Loading..."}
        </div>
      </div>
    </div>
  );
}
