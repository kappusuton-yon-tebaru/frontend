import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Content } from "@/interfaces/github";
import { fetchRepoContents } from "@/hooks/github";

export default function FileAndFolderBar({
  repoContents,
  owner,
  repo,
  tokenAuth,
  currentBranch,
}: {
  repoContents: any;
  owner: string;
  repo: string;
  tokenAuth: string;
  currentBranch: string;
}) {
  const [folders, setFolders] = useState<
    { name: string; path: string; expanded: boolean; files: Content[] }[]
  >([]);
  const [outerFiles, setOuterFiles] = useState<Content[]>([]);
  const [loadedFolderContents, setLoadedFolderContents] = useState<
    Record<string, Content[]>
  >({});

  const organizeContents = (contents: Content[]) => {
    const folderMap: Record<
      string,
      { name: string; path: string; expanded: boolean; files: Content[] }
    > = {};
    const outerFiles: Content[] = [];

    contents.forEach((item) => {
      const pathParts = item.path.split("/");

      if (item.download_url === "") {
        // It's a folder
        folderMap[item.path] = {
          name: item.name,
          path: item.path,
          expanded: false,
          files: [],
        };
      } else {
        // It's a file
        if (pathParts.length === 1) {
          // File is in the outermost level, store it separately
          outerFiles.push(item);
        } else {
          // File belongs to a folder
          const parentPath = pathParts.slice(0, -1).join("/");
          if (!folderMap[parentPath]) {
            folderMap[parentPath] = {
              name: parentPath.split("/").pop() || parentPath,
              path: parentPath,
              expanded: false,
              files: [],
            };
          }
          folderMap[parentPath].files.push(item);
        }
      }
    });

    return { folders: Object.values(folderMap), outerFiles };
  };

  useEffect(() => {
    if (Array.isArray(repoContents)) {
      const sortedContents = [...repoContents].sort((a, b) => {
        return a.download_url === "" && b.download_url !== "" ? -1 : 1;
      });

      const { folders, outerFiles } = organizeContents(sortedContents);
      setFolders(folders);
      setOuterFiles(outerFiles);
    } else {
      setFolders([]);
      setOuterFiles([]);
    }
  }, [repoContents]);

  const toggleFolder = async (folderIndex: number, folderPath: string) => {
    // Toggle the expanded state
    setFolders((prevFolders) =>
      prevFolders.map((folder, i) =>
        i === folderIndex ? { ...folder, expanded: !folder.expanded } : folder
      )
    );

    // If folder is being expanded and has no files yet, fetch its contents
    if (!folders[folderIndex].files.length) {
      try {
        const repoContents = await fetchRepoContents(
          owner,
          repo,
          tokenAuth,
          folderPath,
          currentBranch
        );

        // Sort the fetched contents alphabetically within the folder
        const sortedContents = repoContents
          ? [...repoContents].sort((a, b) => {
              // First, split contents into folders and files
              const aIsFolder = a.download_url === "";
              const bIsFolder = b.download_url === "";

              // If types are different, folders come first
              if (aIsFolder && !bIsFolder) return -1;
              if (!aIsFolder && bIsFolder) return 1;

              // If same type, sort alphabetically
              return a.name.localeCompare(b.name);
            })
          : [];

        // Update the folder with sorted contents
        setFolders((prevFolders) =>
          prevFolders.map((folder, i) =>
            i === folderIndex ? { ...folder, files: sortedContents } : folder
          )
        );
      } catch (error) {
        console.error("Error fetching folder contents:", error);
      }
    }
  };

  return (
    <div className="border border-ci-modal-grey rounded-lg p-2 overflow-y-auto bg-ci-modal-black h-[30vw]">
      {/* Display folders */}
      {folders.map((folder, index) => (
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
              {(loadedFolderContents[folder.path] || folder.files).map(
                (file) => (
                  <div
                    key={file.path}
                    className="flex items-center p-2 hover:bg-[#182B65] cursor-pointer"
                  >
                    <Image
                      src={
                        file.download_url === ""
                          ? `/folder-icon.svg`
                          : `/file-icon.svg`
                      }
                      alt={
                        file.download_url === "" ? `folder-icon` : `file-icon`
                      }
                      width={24}
                      height={24}
                      className="mr-3"
                    />
                    <span>{file.name}</span>
                  </div>
                )
              )}
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
      ))}
    </div>
  );
}
