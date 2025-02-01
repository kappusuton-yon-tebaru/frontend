"use client";
import EntityIndex from "@/components/cicd/EntityIndex";

const searchUrl = "http://localhost:3001/images";

export default function ImagesListPage() {
  const renderEntity = (entity: { id: string; name: string }) => {
    return (
      <div>
        <h3>{entity.name}</h3>
        <p>ID: {entity.id}</p>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-ci-modal-blue">
      <EntityIndex searchUrl={searchUrl} renderEntity={renderEntity} />
    </div>
  );
}
