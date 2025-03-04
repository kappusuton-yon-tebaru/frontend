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

const fetchProjectSpaces = async (orgId: string, page: number) => {
    const response = await getData(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/resources/children/${orgId}?page=${page}&limit=2`
    );
    return {
      data: response.data,
      total: response.total,
      limit: response.limit,
      page: response.page,
    };
  };

export const useProjectSpaces = (orgId: string, page: number) => {
  return useQuery({
    queryKey: ["projectSpaces", orgId, page],
    queryFn: () => fetchProjectSpaces(orgId, page),
  });
};


const fetchRepositories = async (projectSpaceId: string, page: number) => {
  const response = await getData(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/resources/children/${projectSpaceId}?page=${page}&limit=2`
    );
    return {
      data: response.data,
      total: response.total,
      limit: response.limit,
      page: response.page,
    };
}

export const useRepositories = (projectSpaceId: string, page: number) => {
  return useQuery({
    queryKey: ["repositories", projectSpaceId, page],
    queryFn: () => fetchRepositories(projectSpaceId, page),
  })
}

const fetchProjectRepo = async (projectId: string) => {
  const response = await getData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projrepos/project/${projectId}`)
  return response
}

export const useProjectRepo = (projectId: string) => {
  return useQuery({
    queryKey: ["projectRepo", projectId],
    queryFn: () => fetchProjectRepo(projectId),
  })
}