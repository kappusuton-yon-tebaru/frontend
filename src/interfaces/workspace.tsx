export interface Resource {
  id: String;
  resource_name: String;
  resource_type: String;
}

export enum ResourceType {
    Organization = "ORGANIZATION",
    ProjectSpace = "PROJECT_SPACE",
    Project = "PROJECT",
}
