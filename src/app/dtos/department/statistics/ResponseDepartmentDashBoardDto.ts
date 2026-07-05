import { ResponseCountServicesByDepartmentsStatisticsDto } from "./ResponseCountServicesByDepartmentsStatisticsDto"
import { ResponseCountTotalDepartmentsStatisticsDto } from "./ResponseCountTotalDepartmentsStatisticsDto"
import { ResponseDepartmentPercentagesStatisticsDto } from "./ResponseDepartmentPercentagesStatisticsDto"

export interface ResponseDepartmentDashBoardDto {

  countTotalDepartmentsStatistics: ResponseCountTotalDepartmentsStatisticsDto
  countServicesByDepartments: ResponseCountServicesByDepartmentsStatisticsDto[]
  departmentPercentagesStatistics: ResponseDepartmentPercentagesStatisticsDto
}
