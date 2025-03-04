import { getData } from "@/services/baseRequest";
import { useQuery } from "@tanstack/react-query";

const fetchBranches = async (owner: string, repo: string, token: string | null) => {
    if (owner === undefined || repo === undefined) return {data:null}
    if (token === null) return new Error("token is null")
    const response = await getData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/github/${owner}/${repo}/branches`, token);
    return response
}

export const useBranches = (owner: string, repo: string, token: string) => {
    return useQuery({
        queryKey: ["branches", owner, repo, token],
        queryFn: () => fetchBranches(owner, repo, token),
      });
}