import { getData } from "@/services/baseRequest";
import { useQuery } from "@tanstack/react-query";

const fetchResource = async (resourceId: string) => {
  const response = await getData(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/resources/${resourceId}`
  );
  return response;
};

export const useResource = (resourceId: string) => {
  return useQuery({
    queryKey: ["resources", resourceId],
    queryFn: () => fetchResource(resourceId),
  });
};

const fetchProjectSpaces = async (orgId: string, page: number, sortBy: string, sortOrder: string) => {
  const response = await getData(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/resources/children/${orgId}?page=${page}&limit=8&sort_by=${sortBy}&sort_order=${sortOrder}`
  );
  return {
    data: response.data,
    total: response.total,
    limit: response.limit,
    page: response.page,
  };
};

export const useProjectSpaces = (orgId: string, page: number, sortBy: string, sortOrder: string) => {
  return useQuery({
    queryKey: ["projectSpaces", orgId, page, sortBy, sortOrder],
    queryFn: () => fetchProjectSpaces(orgId, page, sortBy, sortOrder),
  });
};

const fetchRepositories = async (projectSpaceId: string, page: number, sortBy: string, sortOrder: string) => {
  const response = await getData(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/resources/children/${projectSpaceId}?page=${page}&limit=4&sort_by=${sortBy}&sort_order=${sortOrder}`
  );
  return {
    data: response.data,
    total: response.total,
    limit: response.limit,
    page: response.page,
  };
};

export const useRepositories = (projectSpaceId: string, page: number, sortBy: string, sortOrder: string) => {
  return useQuery({
    queryKey: ["repositories", projectSpaceId, page, sortBy, sortOrder],
    queryFn: () => fetchRepositories(projectSpaceId, page, sortBy, sortOrder),
  });
};

const fetchProjectRepo = async (projectId: string) => {
  const response = await getData(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/projrepos/project/${projectId}`
  );
  return response;
};

export const useProjectRepo = (projectId: string) => {
  return useQuery({
    queryKey: ["projectRepo", projectId],
    queryFn: () => fetchProjectRepo(projectId),
  });
};
