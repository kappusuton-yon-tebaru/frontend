import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Content } from "@/interfaces/github";
import { fetchRepoContents } from "@/hooks/github";
import { Spin } from "antd";
import { ChevronRight, ChevronDown } from "lucide-react";

type FileOrFolder = {
  name: string;
  path: string;
  type: "dir" | "file";
  children?: FileOrFolder[];
};

export default function FileAndFolderBar({
  repoContents,
  owner,
  repo,
  tokenAuth,
  currentBranch,
}: {
  repoContents: Content[];
  owner: string;
  repo: string;
  tokenAuth: string;
  currentBranch: string;
}) {
  const router = useRouter();
  const { orgId, projSpaceId, repoId } = useParams();
  const [fileTree, setFileTree] = useState<FileOrFolder[]>([]);
  const [folderState, setFolderState] = useState<{
    [key: string]: { isOpen: boolean; isLoading: boolean };
  }>({});

  useEffect(() => {
    if (Array.isArray(repoContents)) {
      setFileTree(buildTree(repoContents));
    }
  }, [repoContents]);

  const buildTree = (contents: Content[]): FileOrFolder[] => {
    const tree: FileOrFolder[] = [];
    const folderMap: Record<string, FileOrFolder> = {};

    contents.forEach((item) => {
      const pathParts = item.path.split("/");
      const name = pathParts.pop() || "";
      const parentPath = pathParts.join("/");

      const node: FileOrFolder = {
        name,
        path: item.path,
        type:
          item.download_url === null || item.download_url === ""
            ? "dir"
            : "file",
        children: [],
      };

      if (!parentPath) {
        tree.push(node);
      } else {
        if (!folderMap[parentPath]) {
          folderMap[parentPath] = {
            name: parentPath.split("/").pop() || "",
            path: parentPath,
            type: "dir",
            children: [],
          };
        }
        folderMap[parentPath].children!.push(node);
      }
      folderMap[item.path] = node;
    });

    // Handle nested folders
    Object.values(folderMap).forEach((folder) => {
      if (folder.children && folder.children.length > 0 && folder.path) {
        const parentPath = folder.path.substring(
          0,
          folder.path.lastIndexOf("/")
        );
        if (parentPath && folderMap[parentPath]) {
          if (!folderMap[parentPath].children) {
            folderMap[parentPath].children = [];
          }
          if (
            !folderMap[parentPath].children.find(
              (child) => child.path === folder.path
            )
          ) {
            folderMap[parentPath].children.push(folder);
          }
        }
      }
    });

    // Sort children in each folder (directories first, then files)
    Object.values(folderMap).forEach((folder) => {
      if (folder.children && folder.children.length > 0) {
        folder.children.sort((a, b) => {
          if (a.type === b.type) {
            return a.name.localeCompare(b.name);
          }
          return a.type === "dir" ? -1 : 1;
        });
      }
    });

    // Return the root level folders, sorted with directories first
    const rootItems = Object.values(folderMap).filter((folder) => {
      if (!folder.path.includes("/")) {
        return true;
      }
      const parentPath = folder.path.substring(0, folder.path.lastIndexOf("/"));
      return !folderMap[parentPath];
    });

    return rootItems.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === "dir" ? -1 : 1;
    });
  };

  const updateTreeWithNewContents = (
    tree: FileOrFolder[],
    folderPath: string,
    contents: Content[]
  ): FileOrFolder[] => {
    return tree.map((item) => {
      if (item.path === folderPath) {
        // Convert the fetched contents to FileOrFolder objects directly
        const children: FileOrFolder[] = contents.map((content) => ({
          name: content.name,
          path: content.path,
          // Determine if it's a directory based on download_url
          type:
            content.download_url === null || content.download_url === ""
              ? "dir"
              : "file",
          children:
            content.download_url === null || content.download_url === ""
              ? []
              : undefined,
        }));

        // Sort children with directories first
        children.sort((a, b) => {
          if (a.type === b.type) {
            return a.name.localeCompare(b.name);
          }
          return a.type === "dir" ? -1 : 1;
        });

        return {
          ...item,
          children: children,
        };
      } else if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: updateTreeWithNewContents(
            item.children,
            folderPath,
            contents
          ),
        };
      }
      return item;
    });
  };

  // Helper function to reset child folder states when parent is closed
  const resetChildFolderStates = (folderPath: string) => {
    // Find all folder states that start with the parent path
    const newFolderState = { ...folderState };

    Object.keys(folderState).forEach((path) => {
      // Check if this is a child path (starts with parent path + /)
      if (path !== folderPath && path.startsWith(`${folderPath}/`)) {
        newFolderState[path] = {
          isOpen: false,
          isLoading: false,
        };
      }
    });

    setFolderState(newFolderState);
  };

  const handleFolderClick = async (folderPath: string) => {
    // First, check if the folder has already been loaded and we just need to toggle
    if (folderState[folderPath]) {
      const isCurrentlyOpen = folderState[folderPath].isOpen;

      // Toggle the folder open/closed
      setFolderState((prev) => ({
        ...prev,
        [folderPath]: {
          isOpen: !isCurrentlyOpen,
          isLoading: false,
        },
      }));

      // If we're closing the folder, reset child states
      if (isCurrentlyOpen) {
        resetChildFolderStates(folderPath);
        setFolderState((prev) => ({
          ...prev,
          [folderPath]: {
            isOpen: !isCurrentlyOpen,
            isLoading: false,
          },
        }));
        return;
      }

      // If the folder has already been loaded, we don't need to fetch its contents again
      const hasBeenLoaded = fileTree.some((item) => {
        if (
          item.path === folderPath &&
          item.children &&
          item.children.length > 0
        ) {
          return true;
        }
        // Check nested items too
        if (item.children) {
          return findFolderInTree(item.children, folderPath);
        }
        return false;
      });

      if (hasBeenLoaded) {
        return;
      }
    }

    // If we get here, we need to load the folder contents
    setFolderState((prev) => ({
      ...prev,
      [folderPath]: {
        isOpen: prev[folderPath]?.isOpen || false,
        isLoading: true,
      },
    }));

    try {
      const contents = await fetchRepoContents(
        owner,
        repo,
        tokenAuth,
        folderPath,
        currentBranch
      );

      setFileTree((prevTree) =>
        updateTreeWithNewContents(prevTree, folderPath, contents)
      );

      setFolderState((prev) => ({
        ...prev,
        [folderPath]: { isOpen: true, isLoading: false },
      }));
    } catch (error) {
      console.error("Error fetching folder contents:", error);
      setFolderState((prev) => ({
        ...prev,
        [folderPath]: {
          isOpen: prev[folderPath]?.isOpen || false,
          isLoading: false,
        },
      }));
    }
  };

  // Helper function to find a folder in the tree
  const findFolderInTree = (
    items: FileOrFolder[],
    folderPath: string
  ): boolean => {
    for (const item of items) {
      if (
        item.path === folderPath &&
        item.children &&
        item.children.length > 0
      ) {
        return true;
      }
      if (item.children && item.children.length > 0) {
        if (findFolderInTree(item.children, folderPath)) {
          return true;
        }
      }
    }
    return false;
  };

  const handleFileClick = (filePath: string) => {
    router.push(
      `/organization/${orgId}/project-space/${projSpaceId}/repository/${repoId}/${filePath}`
    );
  };

  const renderTree = (items: FileOrFolder[]) => {
    return (
      <ul className="pl-2">
        {items.map((item) => (
          <li key={item.path} className="mt-2">
            <div className="flex items-center">
              {item.type === "dir" ? (
                <div>
                  <button
                    onClick={() => handleFolderClick(item.path)}
                    className="flex items-center"
                    disabled={folderState[item.path]?.isLoading}
                  >
                    {folderState[item.path]?.isOpen ? (
                      <ChevronDown size={20} className="text-ci-modal-grey" />
                    ) : (
                      <ChevronRight size={20} className="text-ci-modal-grey" />
                    )}
                    <Image
                      src={
                        folderState[item.path]?.isOpen
                          ? "/folder-open-icon.svg"
                          : "/folder-icon.svg"
                      }
                      alt="folder-icon"
                      width={folderState[item.path]?.isOpen ? 24 : 20}
                      height={folderState[item.path]?.isOpen ? 24 : 20}
                      className="mr-2"
                    />
                    {item.name}
                    {folderState[item.path]?.isLoading && (
                      <Spin className="ml-2" />
                    )}
                  </button>
                  {folderState[item.path]?.isOpen && item.children && (
                    <div className="ml-1">{renderTree(item.children)}</div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleFileClick(item.path)}
                  className="flex items-center ml-5"
                >
                  <Image
                    src="/file-icon.svg"
                    alt="file-icon"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  {item.name}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="border border-ci-modal-grey rounded-lg p-2 overflow-y-auto bg-ci-modal-black h-[30vw]">
      {renderTree(fileTree)}
    </div>
  );
}
