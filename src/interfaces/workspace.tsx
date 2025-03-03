export interface Resource {
  id: string;
  resource_name: string;
  resource_type: string;
  created_at: string;
  updated_at: string;
}

export enum ResourceType {
  Organization = "ORGANIZATION",
  ProjectSpace = "PROJECT_SPACE",
  Project = "PROJECT",
}

export interface User {
  id: string;
  name: string;
}
