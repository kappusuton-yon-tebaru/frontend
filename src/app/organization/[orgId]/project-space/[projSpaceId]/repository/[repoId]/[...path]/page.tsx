"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { dracula } from "@uiw/codemirror-theme-dracula";
import BranchButton from "@/components/BranchButton";
import { useParams, useRouter } from "next/navigation";
import { useProjectRepo, useResource } from "@/hooks/workspace";
import { useBranches, useRepoContents } from "@/hooks/github";
import { Branch, Content } from "@/interfaces/github";
import { Spin } from "antd";
import FileAndFolderBar from "@/components/FileAndFolderBar";

const branches = ["main", "branch 1", "branch 2"];

const folderData = [
  {
    name: "Folder 1",
    date: "31 Feb 2099",
    time: "14:30",
    type: "folder",
    expanded: false,
    files: [
      { name: "File 1.1", date: "31 Feb 2099", time: "14:40", type: "file" },
      { name: "File 1.2", date: "31 Feb 2099", time: "14:50", type: "file" },
    ],
  },
  {
    name: "Folder 2",
    date: "31 Feb 2099",
    time: "10:00",
    type: "folder",
    expanded: false,
    files: [
      { name: "File 2.1", date: "31 Feb 2099", time: "10:10", type: "file" },
      { name: "File 2.2", date: "31 Feb 2099", time: "10:20", type: "file" },
    ],
  },
  {
    name: "Folder 2",
    date: "31 Feb 2099",
    time: "10:00",
    type: "folder",
    expanded: false,
    files: [
      { name: "File 2.1", date: "31 Feb 2099", time: "10:10", type: "file" },
      { name: "File 2.2", date: "31 Feb 2099", time: "10:20", type: "file" },
    ],
  },
  {
    name: "Folder 2",
    date: "31 Feb 2099",
    time: "10:00",
    type: "folder",
    expanded: false,
    files: [
      { name: "File 2.1", date: "31 Feb 2099", time: "10:10", type: "file" },
      { name: "File 2.2", date: "31 Feb 2099", time: "10:20", type: "file" },
    ],
  },
  {
    name: "Folder 2",
    date: "31 Feb 2099",
    time: "10:00",
    type: "folder",
    expanded: false,
    files: [
      { name: "File 2.1", date: "31 Feb 2099", time: "10:10", type: "file" },
      { name: "File 2.2", date: "31 Feb 2099", time: "10:20", type: "file" },
    ],
  },
  {
    name: "Folder 2",
    date: "31 Feb 2099",
    time: "10:00",
    type: "folder",
    expanded: false,
    files: [
      { name: "File 2.1", date: "31 Feb 2099", time: "10:10", type: "file" },
      { name: "File 2.2", date: "31 Feb 2099", time: "10:20", type: "file" },
    ],
  },
  {
    name: "Folder 2",
    date: "31 Feb 2099",
    time: "10:00",
    type: "folder",
    expanded: false,
    files: [
      { name: "File 2.1", date: "31 Feb 2099", time: "10:10", type: "file" },
      { name: "File 2.2", date: "31 Feb 2099", time: "10:20", type: "file" },
    ],
  },
  {
    name: "Folder 2",
    date: "31 Feb 2099",
    time: "10:00",
    type: "folder",
    expanded: false,
    files: [
      { name: "File 2.1", date: "31 Feb 2099", time: "10:10", type: "file" },
      { name: "File 2.2", date: "31 Feb 2099", time: "10:20", type: "file" },
    ],
  },
  {
    name: "Folder 2",
    date: "31 Feb 2099",
    time: "10:00",
    type: "folder",
    expanded: false,
    files: [
      { name: "File 2.1", date: "31 Feb 2099", time: "10:10", type: "file" },
      { name: "File 2.2", date: "31 Feb 2099", time: "10:20", type: "file" },
    ],
  },
  {
    name: "Folder 2",
    date: "31 Feb 2099",
    time: "10:00",
    type: "folder",
    expanded: false,
    files: [
      { name: "File 2.1", date: "31 Feb 2099", time: "10:10", type: "file" },
      { name: "File 2.2", date: "31 Feb 2099", time: "10:20", type: "file" },
    ],
  },
  {
    name: "Folder 2",
    date: "31 Feb 2099",
    time: "10:00",
    type: "folder",
    expanded: false,
    files: [
      { name: "File 2.1", date: "31 Feb 2099", time: "10:10", type: "file" },
      { name: "File 2.2", date: "31 Feb 2099", time: "10:20", type: "file" },
    ],
  },
  {
    name: "Folder 2",
    date: "31 Feb 2099",
    time: "10:00",
    type: "folder",
    expanded: false,
    files: [
      { name: "File 2.1", date: "31 Feb 2099", time: "10:10", type: "file" },
      { name: "File 2.2", date: "31 Feb 2099", time: "10:20", type: "file" },
    ],
  },
];

export default function FileandFolder() {
  // const [folders, setFolders] = useState(folderData);
  const [code, setCode] = useState("// Start typing...");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // const toggleFolder = (index: number) => {
  //   setFolders((prevFolders) =>
  //     prevFolders.map((folder, i) =>
  //       i === index ? { ...folder, expanded: !folder.expanded } : folder
  //     )
  //   );
  // };

  const router = useRouter();
  const { orgId, projSpaceId, repoId, path } = useParams();

  if (typeof orgId === "undefined" || Array.isArray(orgId)) {
    throw new Error("Invalid orgId");
  }

  if (typeof projSpaceId === "undefined" || Array.isArray(projSpaceId)) {
    throw new Error("Invalid projSpaceId");
  }

  if (typeof repoId === "undefined" || Array.isArray(repoId)) {
    throw new Error("Invalid repoId");
  }

  if (typeof path === "undefined") {
    throw new Error("Invalid path");
  }
  const fullPath = Array.isArray(path) ? path.join("/") : path || "";

  const { data: projectRepo, isLoading } = useProjectRepo(repoId);
  const gitRepoUrl = projectRepo?.git_repo_url;
  const owner = gitRepoUrl?.split("/").at(-2);
  const repo = gitRepoUrl?.split("/").at(-1);

  const { data: organization } = useResource(orgId);
  const { data: projectSpace } = useResource(projSpaceId);
  const { data: repository } = useResource(repoId);

  const token = localStorage.getItem("access_token");
  let tokenAuth = "";
  if (token !== null) {
    tokenAuth = token;
  }
  const { data: branches } = useBranches(owner, repo, tokenAuth);
  const [branchesStr, setBranchesStr] = useState<string[]>([]);
  const [currentBranch, setCurrentBranch] = useState<string>("");
  useEffect(() => {
    let branchList: string[] = [];
    if (typeof branches !== "undefined" && branches.data) {
      branches.data.map((br: Branch) => {
        if (br.name === "main") {
          branchList.unshift(br.name);
        } else {
          branchList.push(br.name);
        }
      });
      setBranchesStr(branchList);
      setCurrentBranch(branchList[0]);
    }
  }, [branches]);

  const { data: repoContents } = useRepoContents(
    owner,
    repo,
    tokenAuth,
    "",
    currentBranch
  );
  const [contents, setContents] = useState<Content[]>([]);
  useEffect(() => {
    if (Array.isArray(repoContents)) {
      const sortedContents = [...repoContents].sort((a, b) => {
        return a.download_url === "" && b.download_url !== "" ? -1 : 1;
      });
      setContents(sortedContents);
    } else {
      setContents([]);
    }
  }, [repoContents]);

  // const organizeContents = (contents: Content[]) => {
  //   const folderMap: Record<
  //     string,
  //     { name: string; path: string; expanded: boolean; files: Content[] }
  //   > = {};
  //   const outerFiles: Content[] = [];

  //   contents.forEach((item) => {
  //     const pathParts = item.path.split("/");

  //     if (item.download_url === "") {
  //       // It's a folder
  //       folderMap[item.path] = {
  //         name: item.name,
  //         path: item.path,
  //         expanded: false,
  //         files: [],
  //       };
  //     } else {
  //       // It's a file
  //       if (pathParts.length === 1) {
  //         // File is in the outermost level, store it separately
  //         outerFiles.push(item);
  //       } else {
  //         // File belongs to a folder
  //         const parentPath = pathParts.slice(0, -1).join("/");
  //         if (!folderMap[parentPath]) {
  //           folderMap[parentPath] = {
  //             name: parentPath.split("/").pop() || parentPath,
  //             path: parentPath,
  //             expanded: false,
  //             files: [],
  //           };
  //         }
  //         folderMap[parentPath].files.push(item);
  //       }
  //     }
  //   });

  //   return { folders: Object.values(folderMap), outerFiles };
  // };

  // const [folders, setFolders] = useState<
  //   { name: string; path: string; expanded: boolean; files: Content[] }[]
  // >([]);
  // const [outerFiles, setOuterFiles] = useState<Content[]>([]);

  // useEffect(() => {
  //   if (Array.isArray(repoContents)) {
  //     const sortedContents = [...repoContents].sort((a, b) => {
  //       return a.download_url === "" && b.download_url !== "" ? -1 : 1;
  //     });

  //     const { folders, outerFiles } = organizeContents(sortedContents);
  //     setFolders(folders);
  //     setOuterFiles(outerFiles);
  //   } else {
  //     setFolders([]);
  //     setOuterFiles([]);
  //   }
  // }, [repoContents]);

  // const toggleFolder = async (folderIndex: number, folderPath: string) => {
  //   setFolders((prevFolders) =>
  //     prevFolders.map((folder, i) =>
  //       i === folderIndex ? { ...folder, expanded: !folder.expanded } : folder
  //     )
  //   );

  //   // If folder is being expanded and has no files yet, fetch its contents
  //   if (!folders[folderIndex].files.length) {
  //     const { data: repoContents } = useRepoContents(
  //       owner,
  //       repo,
  //       tokenAuth,
  //       folderPath,
  //       currentBranch
  //     );
  //     setFolders((prevFolders) =>
  //       prevFolders.map((folder, i) =>
  //         i === folderIndex ? { ...folder, files: repoContents } : folder
  //       )
  //     );
  //   }
  // };

  if (isLoading || !owner || !repo || !repoContents || !currentBranch) {
    return <Spin />;
  }

  return (
    <div>
      <div className="flex flex-row font-bold text-[24px] ml-[-8px] mb-2">
        <h1
          className="cursor-pointer px-2 hover:bg-ci-modal-black rounded-md"
          onClick={() => {
            router.push(`/organization/${orgId}/`);
          }}
        >
          {organization?.resource_name}
        </h1>
        <h1 className="mx-1">/</h1>
        <h1
          className="cursor-pointer px-2 hover:bg-ci-modal-black rounded-md"
          onClick={() => {
            router.push(`/organization/${orgId}/project-space/${projSpaceId}`);
          }}
        >
          {projectSpace?.resource_name}
        </h1>
        <h1 className="mx-1">/</h1>
        <h1
          className="cursor-pointer px-2 hover:bg-ci-modal-black rounded-md"
          onClick={() => {
            router.push(
              `/organization/${orgId}/project-space/${projSpaceId}/repository/${repoId}`
            );
          }}
        >
          {repository?.resource_name}
        </h1>
      </div>
      <div className="grid grid-cols-[25%_75%] gap-4">
        <div className="flex flex-col gap-y-4">
          <div className="relative w-full">
            <BranchButton
              wide={false}
              branches={branchesStr}
              currentBranch={currentBranch}
              onSelectBranch={setCurrentBranch}
            />
          </div>

          {/* <div className="border border-ci-modal-grey rounded-lg p-2 overflow-y-auto bg-ci-modal-black h-[30vw]"> */}
          {/* Display folders */}
          {/* {folders.map((folder, index) => (
              <div key={folder.path} className="mb-2">
                <div
                  className="flex items-center cursor-pointer p-2 hover:bg-[#182B65]"
                  onClick={() => toggleFolder(index, folder.path)}
                >
                  <span className="mr-2">{folder.expanded ? "▼" : "▶"}</span>
                  <Image
                    src={`/folder-icon.svg`}
                    alt={`folder-icon`}
                    width={24}
                    height={24}
                    className="mr-3"
                  />
                  <span className="font-bold">{folder.name}</span>
                </div>

                {folder.expanded && (
                  <div className="ml-6">
                    {folder.files.map((file) => (
                      <div
                        key={file.path}
                        className="flex items-center p-2 hover:bg-[#182B65] cursor-pointer"
                      >
                        <Image
                          src={`/file-icon.svg`}
                          alt={`file-icon`}
                          width={24}
                          height={24}
                          className="mr-3"
                        />
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {outerFiles.map((file) => (
              <div
                key={file.path}
                className="flex items-center p-2 hover:bg-[#182B65] cursor-pointer"
              >
                <Image
                  src={`/file-icon.svg`}
                  alt={`file-icon`}
                  width={24}
                  height={24}
                  className="mr-3"
                />
                <span>{file.name}</span>
              </div>
            ))} */}
          {/* </div> */}
          <FileAndFolderBar
            repoContents={repoContents}
            owner={owner}
            repo={repo}
            tokenAuth={tokenAuth}
            currentBranch={currentBranch}
          />

          <textarea
            name=""
            id=""
            placeholder="Commit Message"
            className="rounded-lg flex items-center text-black p-2 h-10"
          />
          <button className="bg-ci-bg-dark-blue w-full border border-ci-modal-grey py-2 rounded-lg">
            Commit and Push
          </button>
        </div>

        <div className="p-4 bg-ci-modal-black rounded-lg border border-ci-modal-grey h-full">
          <div className="flex justify-between items-center">
            <div className="flex flex-row gap-6 items-center">
              <div>{fullPath}</div>
              <div className="text-ci-modal-grey">Commit 1</div>
            </div>
            <div className="flex flex-row gap-6 items-center">
              {isEditing && (
                <>
                  <button
                    className="border rounded-md px-4 py-1 bg-ci-modal-light-blue"
                    onClick={() => setIsEditing(false)}
                  >
                    Confirm
                  </button>
                  <button
                    className="border rounded-md px-4 py-1 bg-ci-modal-red"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </>
              )}
              <button
                className={`border rounded-lg p-2 ${
                  isEditing && "bg-ci-modal-light-blue"
                }`}
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                <Image
                  src={`/edit-icon.svg`}
                  alt={`edit-icon`}
                  width={16}
                  height={16}
                />
              </button>
              <div className="text-ci-modal-grey">aaaaa</div>
              <div className="text-ci-modal-grey">26 Oct 2024, 15:00</div>
            </div>
          </div>
          <CodeMirror
            value={code}
            height="660px"
            theme={dracula}
            extensions={[javascript()]}
            onChange={(value) => setCode(value)}
            className="mt-4"
          />
        </div>
      </div>
    </div>
  );
}
