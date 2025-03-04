"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { getData } from "@/services/baseRequest";
import { Button, Input, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import Selector, { SelectorOption } from "./Selector";

interface Entity {
  id: string;
  name: string;
  [key: string]: any;
}

interface EntityIndexProps {
  topic: string;
  description?: string;
  searchUrl: string;
  operationTopic?: string;
  operationUrl?: string;
  renderEntity: (entity: any) => React.ReactNode;
  queryKey?: string;
  sortByOptions?: SelectorOption[];
}

export default function EntityIndex({
  topic,
  description,
  searchUrl,
  operationTopic,
  operationUrl,
  renderEntity,
  queryKey,
  sortByOptions,
}: EntityIndexProps) {
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState<SelectorOption | null>(
    sortByOptions ? sortByOptions[0] : null
  );

  const [data, setData] = useState();

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const router = useRouter();

  const fetchData = async (page: number) => {
    try {
      const params = new URLSearchParams();

      if (page) params.append("page", page.toString());
      if (pageSize) params.append("limit", pageSize.toString());
      if (searchTerm) params.append("query", searchTerm);
      if (sortBy?.label) params.append("sort_by", sortBy.label);
      if (sortOrder) params.append("sort_order", sortOrder);

      const data = await getData(
        `${searchUrl}?${params.toString()}`,
        process.env.NEXT_PUBLIC_GITHUB_TOKEN //wait for auth
      );
      setData(data);
      return data;
    } catch (error) {
      const errMessage =
        error instanceof Error ? error.message : "Unknown error";
      setError(errMessage);
    }
  };

  const {
    data: entities,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      queryKey ? queryKey : "entity",
      page,
      searchTerm,
      sortBy,
      sortOrder,
    ],
    queryFn: async () => await fetchData(page), // This ensures that the old data is used while fetching
    initialData: data,
  });

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-row justify-between font-bold items-center">
          <h2 className="text-2xl">{topic}</h2>
          {operationTopic && operationUrl && (
            <button
              className="bg-ci-modal-black hover:bg-ci-modal-blue border-y border-x border-ci-modal-grey w-1/6 py-2 rounded-lg text-base"
              onClick={() => router.push(operationUrl)}
            >
              {operationTopic}
            </button>
          )}
        </div>
        {description && (
          <div className="text-lg text-ci-modal-grey">{description}</div>
        )}
        <div className="flex flex-col justify-between items-center mb-4 gap-x-4 gap-y-6">
          <div className="flex flex-row w-full gap-x-4 items-end">
            <Input.Search
              placeholder="Search..."
              allowClear
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={(value) => {
                setSearchTerm(value);
                setPage(1);
                refetch();
              }}
              size="large"
              className="w-full"
              enterButton={
                <Button
                  type="primary"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-2 flex items-center justify-center"
                >
                  <SearchOutlined className="text-lg" />
                </Button>
              }
            />
            {sortByOptions && (
              <>
                <div className="flex flex-col w-1/6 gap-y-2">
                  <label className="text-base font-semibold ">
                    Sort Order:{" "}
                  </label>
                  <button
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className="items-center w-full px-4 bg-ci-modal-black border border-ci-modal-grey rounded-lg text-base cursor-pointer min-h-[40px] text-left"
                  >
                    {sortOrder === "asc" ? "Descending" : "Ascending"}
                  </button>
                </div>
                <div className="flex flex-col w-1/6 gap-y-2">
                  <label className="text-base font-semibold">Sort By: </label>
                  <Selector
                    options={sortByOptions}
                    onSelect={setSortBy}
                    initialOption={sortByOptions[0] || null}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <hr className="border-t border-gray-300 col-span-6" />
      </div>
      <div className="flex flex-col">
        {entities &&
          entities.data &&
          entities.data.map(
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
        {!entities && !isLoading && (
          <div className="flex flex-col items-center text-lg font-bold py-4">
            This directory is empty
          </div>
        )}
      </div>
      {entities && (
        <div className="mt-4 flex justify-center w-full">
          <Pagination
            current={page}
            total={entities.total}
            pageSize={pageSize}
            onChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
