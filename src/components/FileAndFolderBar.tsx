import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Content } from "@/interfaces/github";
import { fetchRepoContents } from "@/hooks/github";
import { Spin } from "antd";
import { ChevronRight, ChevronDown } from "lucide-react";
import { FileOrFolder } from "@/interfaces/github";

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
  const pathname = usePathname();
  const [fileTree, setFileTree] = useState<FileOrFolder[]>([]);
  const [folderState, setFolderState] = useState<{
    [key: string]: { isOpen: boolean; isLoading: boolean };
  }>({});
  const [loading, setLoading] = useState<boolean>(false);

  let filePath = "";
  if (pathname) {
    const baseUrl = `/organization/${orgId}/project-space/${projSpaceId}/repository/${repoId}/`;
    if (pathname.startsWith(baseUrl)) {
      filePath = pathname.substring(baseUrl.length);
    }
  }

  useEffect(() => {
    if (Array.isArray(repoContents)) {
      setFileTree(buildTree(repoContents));
    }
  }, [repoContents]);

  useEffect(() => {
    if (filePath !== "") {
      openParentFolders(filePath);
    }
  }, [pathname, orgId, projSpaceId, repoId]);

  const openParentFolders = async (filePath: string) => {
    setLoading(true);
    const pathParts = filePath.split("/");
    pathParts.pop();

    const folderPaths: string[] = [];
    let currentPath = "";

    for (const part of pathParts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      folderPaths.push(currentPath);
    }

    for (const folderPath of folderPaths) {
      const folderLoaded = findFolderInTree(fileTree, folderPath);

      if (!folderLoaded) {
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
        } catch (error) {
          console.error(`Error fetching folder: ${folderPath}`, error);
        }
      }

      setFolderState((prev) => ({
        ...prev,
        [folderPath]: { isOpen: true, isLoading: false },
      }));
    }
    setLoading(false);
  };

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
        const children: FileOrFolder[] = contents.map((content) => ({
          name: content.name,
          path: content.path,
          type:
            content.download_url === null || content.download_url === ""
              ? "dir"
              : "file",
          children:
            content.download_url === null || content.download_url === ""
              ? []
              : undefined,
        }));

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

  const resetChildFolderStates = (folderPath: string) => {
    const newFolderState = { ...folderState };

    Object.keys(folderState).forEach((path) => {
      if (path !== folderPath && path.startsWith(`${folderPath}/`)) {
        newFolderState[path] = {
          isOpen: false,
          isLoading: false,
        };
      }
    });

    setFolderState(newFolderState);
  };

  const handleFolderClick = (folderPath: string) => {
    router.push(
      `/organization/${orgId}/project-space/${projSpaceId}/repository/${repoId}/${folderPath}`,
      { scroll: false }
    );

    setFolderState((prev) => ({
      ...prev,
      [folderPath]: { isOpen: true, isLoading: false },
    }));
  };

  const handleChevronClick = async (folderPath: string) => {
    const isCurrentlyOpen = folderState[folderPath]?.isOpen;

    setFolderState((prev) => ({
      ...prev,
      [folderPath]: { isOpen: !isCurrentlyOpen, isLoading: false },
    }));

    if (isCurrentlyOpen) {
      resetChildFolderStates(folderPath);
      setFolderState((prev) => ({
        ...prev,
        [folderPath]: { isOpen: !isCurrentlyOpen, isLoading: false },
      }));
      return;
    }

    const folderExists = fileTree.some(
      (item) =>
        item.path === folderPath && item.children && item.children.length > 0
    );

    if (folderExists) return;

    setFolderState((prev) => ({
      ...prev,
      [folderPath]: { isOpen: true, isLoading: true },
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
      <ul>
        {items.map((item) => (
          <li key={item.path}>
            <div className="flex items-center">
              {item.type === "dir" ? (
                <div className="w-full">
                  <button
                    onClick={() => handleFolderClick(item.path)}
                    className={`flex items-center w-full rounded-md ${
                      filePath === item.path
                        ? "bg-ci-modal-blue rounded-md"
                        : "hover:bg-ci-bg-dark-blue"
                    } py-1 px-2`}
                    disabled={folderState[item.path]?.isLoading}
                  >
                    {folderState[item.path]?.isOpen ? (
                      <ChevronDown
                        size={20}
                        className="text-ci-modal-grey rounded-full mr-1 hover:bg-ci-modal-black"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChevronClick(item.path);
                        }}
                      />
                    ) : (
                      <ChevronRight
                        size={20}
                        className="text-ci-modal-grey rounded-full mr-1 hover:bg-ci-modal-black"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChevronClick(item.path);
                        }}
                      />
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
                    <div className="ml-2">{renderTree(item.children)}</div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleFileClick(item.path)}
                  className={`flex items-center w-full rounded-md ${
                    filePath === item.path
                      ? "bg-ci-modal-blue rounded-md"
                      : "hover:bg-ci-bg-dark-blue"
                  } py-1 px-2`}
                >
                  <Image
                    src="/file-icon.svg"
                    alt="file-icon"
                    width={20}
                    height={20}
                    className="mr-2 ml-5"
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
      {loading ? <Spin /> : renderTree(fileTree)}
    </div>
  );
}
