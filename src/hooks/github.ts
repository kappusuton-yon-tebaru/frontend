import { getData } from "@/services/baseRequest";
import { useQuery } from "@tanstack/react-query";

const fetchBranches = async (owner: string, repo: string) => {
    const response = await getData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/github/${owner}/${repo}/branches`);
    return response
}

export const useBranches = (owner: string, repo: string) => {
    return useQuery({
        queryKey: ["branches", owner, repo],
        queryFn: () => fetchBranches(owner, repo),
      });
}