"use client";

import Image from "next/image";
import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { dracula } from "@uiw/codemirror-theme-dracula";

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

export default function File() {
  const [folders, setFolders] = useState(folderData);
  const [code, setCode] = useState("// Start typing...");

  const toggleFolder = (index: number) => {
    setFolders((prevFolders) =>
      prevFolders.map((folder, i) =>
        i === index ? { ...folder, expanded: !folder.expanded } : folder
      )
    );
  };

  return (
    <div className="">
      <h1 className="font-bold text-[24px] mb-5">Repositories</h1>
      <div className="grid grid-cols-[30%_70%] gap-4">
        <div className="flex flex-col gap-y-4">
          <div className="relative w-full">
            <Image
              src={`/git-branch-icon.svg`}
              alt="git-branch-icon"
              width={24}
              height={24}
              className="absolute top-1/2 transform -translate-y-1/2 left-2"
            />
            <select className="truncate border border-ci-modal-grey px-7 py-2 bg-ci-modal-black rounded-md font-bold text-white w-full">
              <option value="1">Branch 1</option>
              <option value="2">Branch 2</option>
            </select>
          </div>

          <div className="border border-ci-modal-grey rounded-lg p-2 overflow-y-auto bg-ci-modal-black h-[30vw]">
            {folders.map((folder, index) => (
              <div key={index} className="mb-2">
                <div
                  className="flex items-center cursor-pointer p-2 hover:bg-[#182B65] "
                  onClick={() => toggleFolder(index)}
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
                    {folder.files.map((file, fileIndex) => (
                      <div
                        key={fileIndex}
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
          </div>
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

        <div className="p-4 bg-ci-modal-black rounded-lg border border-ci-modal-grey">
          <h2 className="text-lg font-bold mb-2">Code Editor</h2>
          <CodeMirror
            value={code}
            height="450px"
            theme={dracula}
            extensions={[javascript()]}
            onChange={(value) => setCode(value)}
          />
        </div>
      </div>
    </div>
  );
}
