import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFileContent } from "@/hooks/github";
import { EditorView } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { markdown } from "@codemirror/lang-markdown";
import { yaml } from "@codemirror/lang-yaml";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { json } from "@codemirror/lang-json";
import { EditorState } from "@codemirror/state";
import { putData } from "@/services/baseRequest";
import { Spin } from "antd";
import { useToken } from "@/context/TokenContext";

export default function CodeEditor({
  owner,
  repo,
  token,
  path,
  branch,
  isEditing,
  setIsEditing,
}: {
  owner: string;
  repo: string;
  token: string;
  path: string;
  branch: string;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}) {
  const { data, isLoading, error } = useFileContent(
    owner,
    repo,
    token,
    path,
    branch
  );
  const [code, setCode] = useState("");
  const [originalCode, setOriginalCode] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [extensions, setExtensions] = useState<any[]>([
    basicSetup,
    EditorView.lineWrapping,
  ]);
  const [isCommitting, setIsCommitting] = useState(false);
  const [sha, setSha] = useState<string>("");
  const { tokenAuth } = useToken();
  const getFileExtension = (filePath: string) => {
    return filePath.split(".").pop()?.toLowerCase() || "";
  };

  useEffect(() => {
    const processFileContent = () => {
      const fileContent = data?.content || "";
      setSha(data?.sha);
      setCode(fileContent);
      setOriginalCode(fileContent);

      const fileExtension = getFileExtension(path);
      const newExtensions = [basicSetup, EditorView.lineWrapping, oneDark];

      switch (fileExtension) {
        case "js":
          newExtensions.push(javascript());
          break;
        case "jsx":
          newExtensions.push(javascript({ jsx: true }));
          break;
        case "ts":
          newExtensions.push(javascript({ typescript: true }));
          break;
        case "tsx":
          newExtensions.push(javascript({ typescript: true, jsx: true }));
          break;
        case "md":
          newExtensions.push(markdown());
          break;
        case "yaml":
        case "yml":
          newExtensions.push(yaml());
          break;
        case "css":
          newExtensions.push(css());
          break;
        case "html":
          newExtensions.push(html());
          break;
        case "json":
          newExtensions.push(json());
          break;
        default:
          newExtensions.push(javascript());
          break;
      }

      if (!isEditing) {
        newExtensions.push(EditorState.readOnly.of(true));
      }

      setExtensions(newExtensions);
    };

    if (data) {
      processFileContent();
    }
  }, [data, path, isEditing]);

  const handleCommitAndPush = async () => {
    if (!commitMessage.trim()) {
      alert("Please enter a commit message");
      return;
    }

    setIsCommitting(true);
    try {
      const response = await putData(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/github/${owner}/${repo}/push`,
        {
          path: path,
          message: commitMessage,
          base64Content: btoa(code),
          sha: sha,
          branch: branch,
        },
        tokenAuth
      );
      window.location.reload();
    } catch (error) {
      console.error("Error committing and pushing:", error);
      alert("Failed to commit and push changes");
    } finally {
      setIsCommitting(false);
    }
  };

  if (isLoading) return <Spin />;
  if (error)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;

  const handleChange = (value: string) => {
    setCode(value);
  };

  return (
    <div className="h-full w-full mt-2">
      <CodeMirror
        value={code}
        height="70vh"
        theme={oneDark}
        extensions={extensions}
        onChange={handleChange}
        editable={isEditing}
      />
      {isEditing && (
        <div className="flex items-center gap-4 mt-4">
          <input
            className="px-4 py-2 w-full bg-ci-modal-black hover:bg-ci-modal border border-ci-modal-grey rounded-lg text-base placeholder:text-sm"
            type="text"
            placeholder="Commit message"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
          />
          <button
            className="border rounded-md w-56 px-4 py-2 bg-ci-bg-dark-blue text-white hover:bg-blue-600 transition-colors"
            onClick={handleCommitAndPush}
            disabled={isCommitting}
          >
            {isCommitting ? "Committing..." : "Commit and Push"}
          </button>
          <button
            className="border rounded-md w-56 px-4 py-2 bg-ci-modal-red text-white hover:bg-red-600 transition-colors"
            onClick={() => {
              setIsEditing(false);
              setCode(originalCode);
              setCommitMessage("");
            }}
            disabled={isCommitting}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
