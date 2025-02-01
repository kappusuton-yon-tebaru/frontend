"use client";

import React, { useEffect, useState } from "react";

interface Entity {
  id: string;
  name: string;
  [key: string]: any;
}

interface EntityIndexProps {
  searchUrl: string;
  renderEntity: (entity: Entity) => React.ReactNode;
}

export default function EntityIndex({
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
    <div>
      <h2>Entities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entities.map((entity) => (
          <div key={entity.id} className="p-4 border rounded shadow">
            {/* Use the renderEntity callback to render the child component */}
            {renderEntity(entity)}
          </div>
        ))}
      </div>
    </div>
  );
}
