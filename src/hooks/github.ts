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

export const fetchRepoContents = async (owner: string, repo: string, token: string | null, path?: string, branch?: string) => {
    if (owner === undefined || repo === undefined) return {data:null}
    if (path === undefined) path = ""
    if (branch === undefined) branch = ""
    if (token === null) return new Error("token is null")
    if (path.includes(".")) return []
    const response = await getData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/github/${owner}/${repo}/contents?path=${path}&branch=${branch}`, token);
    return response.data
}

export const useRepoContents = (owner: string, repo: string, token: string, path?: string, branch?: string) => {
    return useQuery({
        queryKey: ["repoContents", owner, repo, token, path, branch],
        queryFn: () => fetchRepoContents(owner, repo, token, path, branch),
      });
}

const fetchCommitMetadata = async (owner: string, repo: string, token: string | null, path?: string, branch?: string) => {
    if (owner === undefined || repo === undefined) return {data:null}
    if (path === undefined) path = ""
    if (branch === undefined) branch = ""
    if (token === null) return new Error("token is null")
    const response = await getData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/github/${owner}/${repo}/commit-metadata?path=${path}&branch=${branch}`, token);
    return response.data
}

export const useCommitMetadata = (owner: string, repo: string, token: string, path?: string, branch?: string) => {
    return useQuery({
        queryKey: ["metadata", owner, repo, token, path, branch],
        queryFn: () => fetchCommitMetadata(owner, repo, token, path, branch),
      });
}

const fetchAllUserRepos = async (token: string) => {
    if (token === null) return new Error("token is null")
    const response = await getData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/github/userrepos`, token);
    return response.data
}

export const useAllUserRepos = (token: string) => {
    return useQuery({
        queryKey: ["userRepos", token],
        queryFn: () => fetchAllUserRepos(token),
    });
}

const fetchFileContent = async (owner: string, repo: string, token: string, path: string, branch: string) => {
    if (owner === undefined || repo === undefined) return {data:null}
    if (path === undefined) path = ""
    if (branch === undefined) branch = ""
    if (token === null) return new Error("token is null")
    const response = await getData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/github/${owner}/${repo}/file-content?path=${path}&branch=${branch}`, token);
    return response.data
}

export const useFileContent = (owner: string, repo: string, token: string, path: string, branch: string) => {
    return useQuery({
        queryKey: ["fileContent", owner, repo, token, path, branch],
        queryFn: () => fetchFileContent(owner, repo, token, path, branch),
    })
}