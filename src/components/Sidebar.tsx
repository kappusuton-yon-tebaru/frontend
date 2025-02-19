"use client";
import { useState } from "react";

const Sidebar = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleExpand = (space: string) => {
    setExpanded(expanded === space ? null : space);
  };

  const projectSpaces = {
    "Project Space 1": ["Repository 1", "Repository 2"],
    "Project Space 2": ["Repository 3", "Repository 4"],
  };

  return (
    <div className="flex flex-col mt-16 pt-8 pl-8 bg-ci-modal-black h-[100vh] w-1/6 space-y-6 text-white select-none fixed left-0 top-0 font-bold">
      {Object.entries(projectSpaces).map(([space, projects]) => (
        <div key={space} className="cursor-pointer">
          <div
            className="p-2 transition flex flex-row items-center space-x-2"
            onClick={() => toggleExpand(space)}
          >
            <span className="text-ci-modal-grey hover:no-underline">
              {expanded === space ? "▼" : "▶"}
            </span>
            <span className="hover:underline">{space}</span>
          </div>

          {expanded === space && (
            <div className="pl-4 mt-2 space-y-1">
              {projects.map((project) => (
                <div key={project} className="p-2 rounded-md">
                  {project}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
