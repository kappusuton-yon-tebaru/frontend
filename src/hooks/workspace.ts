import { getData } from "@/services/baseRequest";
import { useQuery } from "@tanstack/react-query";

const fetchOrganization = async (orgId: string) => {
  const response = await getData(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/resources/${orgId}`
  );
  return response;
};

export const useOrganization = (orgId: string) => {
  return useQuery({
    queryKey: ["organization", orgId],
    queryFn: () => fetchOrganization(orgId),
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