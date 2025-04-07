"use client";
import RepositoryPage from "@/components/RepositoryPage";
import { useParams } from "next/navigation";

export default function RepositoryWithBranch() {
  const { branch } = useParams();
  const decodedBranch = decodeURIComponent(branch as string);
  return <RepositoryPage branchURL={decodedBranch} />;
}
