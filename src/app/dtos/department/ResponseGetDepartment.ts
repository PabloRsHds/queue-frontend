export interface ResponseGetDepartmentDto {
  departmentId: string;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  services: string[];
}
