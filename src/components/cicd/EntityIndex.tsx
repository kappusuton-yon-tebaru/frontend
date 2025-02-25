"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { getData } from "@/services/baseRequest";
import { Pagination } from "antd";
import { useQuery } from "@tanstack/react-query";

interface Entity {
  id: string;
  name: string;
  [key: string]: any;
}

interface EntityIndexProps {
  topic: string;
  searchUrl: string;
  operationTopic?: string;
  operationUrl?: string;
  renderEntity: (entity: any) => React.ReactNode;
  queryKey: string;
}

export default function EntityIndex({
  topic,
  searchUrl,
  operationTopic,
  operationUrl,
  renderEntity,
  queryKey,
}: EntityIndexProps) {
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 2;

  const router = useRouter();

  const fetchData = async (page: number) => {
    try {
      const data = await getData(searchUrl);
      return data.data;
    } catch (error) {
      const errMessage =
        error instanceof Error ? error.message : "Unknown error";
      setError(errMessage);
    }
  };

  const { data: entities, isLoading } = useQuery({
    queryKey: [queryKey, page],
    queryFn: async () => await fetchData(page),
  });

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-20 flex justify-center items-center">
  //       <ClipLoader
  //         size={100}
  //         color={"#245FA1"}
  //         cssOverride={{
  //           borderWidth: "10px",
  //         }}
  //         loading={isLoading}
  //       />
  //     </div>
  //   );
  // }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex flex-row justify-between font-bold items-center">
        <h2 className="text-xl">{topic}</h2>
        {operationTopic && operationUrl && (
          <button
            className="bg-ci-modal-black hover:bg-ci-modal-blue border-y border-x border-ci-modal-grey w-1/6 py-2 rounded-lg text-base"
            onClick={() => router.push(operationUrl)}
          >
            {operationTopic}
          </button>
        )}
      </div>
      <div className="flex flex-col">
        {entities &&
          entities.map(
            (entity: Entity, index: React.Key | null | undefined) => {
              const isFirst = index === 0;
              const isLast = index === entities.length - 1;

              return (
                <div
                  key={index}
                  className={`${isFirst ? "rounded-t-lg" : ""} ${
                    isLast ? "rounded-b-lg" : ""
                  } bg-ci-modal-black hover:bg-ci-modal-blue border-y border-x border-ci-modal-grey`}
                >
                  {renderEntity(entity)}
                </div>
              );
            }
          )}
        {!entities && (
          <div className="flex flex-col items-center text-lg font-bold py-4">
            This directory is empty
          </div>
        )}
      </div>
      {entities && (
        <div className="mt-4 flex justify-center w-full">
          <Pagination
            current={page}
            total={entities?.length}
            pageSize={pageSize}
            onChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
