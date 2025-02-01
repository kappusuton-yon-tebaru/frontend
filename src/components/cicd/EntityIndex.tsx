"use client";

import React, { useEffect, useState } from "react";

interface Entity {
  id: string;
  name: string;
  [key: string]: any;
}

interface EntityIndexProps {
  topic: string;
  searchUrl: string;
  renderEntity: (entity: Entity) => React.ReactNode;
}

export default function EntityIndex({
  topic,
  searchUrl,
  renderEntity,
}: EntityIndexProps) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-y-8">
      <h2 className="text-xl font-bold">{topic}</h2>
      <div className="flex flex-col">
        {entities.map((entity) => (
          <div key={entity.id}>{renderEntity(entity)}</div>
        ))}
      </div>
    </div>
  );
}
