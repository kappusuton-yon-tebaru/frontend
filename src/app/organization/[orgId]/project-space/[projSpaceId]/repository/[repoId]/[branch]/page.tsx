"use client";
import RepositoryPage from "@/components/RepositoryPage";
import { useParams } from "next/navigation";

export default function RepositoryWithBranch() {
  const { branch } = useParams();
  if (typeof branch === "undefined" || Array.isArray(branch)) {
    throw new Error("Invalid branch");
  }
  return <RepositoryPage branchURL={branch} />;
}
