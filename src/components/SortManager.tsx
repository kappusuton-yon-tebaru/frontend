import { useState } from "react";
import SortButton from "./SortButton";
import { Button } from "antd";

export default function SortManager() {
  const [sorting, setSorting] = useState<string>("Ascending");
  return (
    <div className="flex h-full gap-8">
      <SortButton />
      <Button
        className="h-full w-60 text-[18px] border border-ci-modal-grey px-6 py-1 bg-ci-modal-black rounded-md font-medium hover:bg-ci-modal-blue transition-all duration-300 ease-in-out"
        onClick={() => {
          if (sorting === "Ascending") {
            setSorting("Descending");
          } else {
            setSorting("Ascending");
          }
        }}
      >
        {sorting}
      </Button>
    </div>
  );
}
