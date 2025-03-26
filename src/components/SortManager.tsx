import { useState } from "react";
import SortButton from "./SortButton";
import { Button } from "antd";

export default function SortManager({
  sorting,
  setSorting,
  sortOrder,
  setSortOrder,
}: {
  sorting: string;
  setSorting: (e: any) => void;
  sortOrder: string;
  setSortOrder: (e: any) => void;
}) {
  return (
    <div className="flex h-full gap-8">
      <SortButton sorting={sorting} setSorting={setSorting} />
      <Button
        className="h-full w-60 text-[18px] border border-ci-modal-grey px-6 py-1 bg-ci-modal-black rounded-md font-medium hover:bg-ci-modal-blue transition-all duration-300 ease-in-out"
        onClick={() => {
          if (sortOrder === "asc") {
            setSortOrder("desc");
          } else {
            setSortOrder("asc");
          }
        }}
      >
        {sortOrder === "asc" ? "Ascending" : "Descending"}
      </Button>
    </div>
  );
}
