"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";

interface Entity {
  id: string;
  name: string;
  [key: string]: any;
}

interface EntityIndexProps {
  topic: string;
  searchUrl: string;
  operationTopic: string;
  operationUrl: string;
  renderEntity: (entity: Entity) => React.ReactNode;
}

export default function EntityIndex({
  topic,
  searchUrl,
  operationTopic,
  operationUrl,
  renderEntity,
}: EntityIndexProps) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(searchUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setEntities(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-20 flex justify-center items-center">
        <ClipLoader
          size={100}
          color={"#245FA1"}
          cssOverride={{
            borderWidth: "10px",
          }}
          loading={loading}
        />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex flex-row justify-between font-bold items-center">
        <h2 className="text-xl">{topic}</h2>
        <button
          className="bg-ci-modal-black hover:bg-ci-modal-blue border-y border-x border-ci-modal-grey w-1/6 py-2 rounded-lg text-base"
          onClick={() => router.push(operationUrl)}
        >
          {operationTopic}
        </button>
      </div>
      <div className="flex flex-col">
        {entities.map((entity, index) => {
          const isFirst = index === 0;
          const isLast = index === entities.length - 1;

          return (
            <div
              key={entity.id}
              className={`${isFirst ? "rounded-t-lg" : ""} ${
                isLast ? "rounded-b-lg" : ""
              } bg-ci-modal-black hover:bg-ci-modal-blue border-y border-x border-ci-modal-grey`}
            >
              {renderEntity(entity)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
