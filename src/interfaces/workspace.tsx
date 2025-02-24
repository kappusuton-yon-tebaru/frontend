export interface Resource {
  id: string;
  resource_name: string;
  resource_type: string;
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
