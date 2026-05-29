import { PageResponse } from '../../dtos/page/PageResponse';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseServiceManagementDto } from '../../dtos/services/ResponseServiceManagementDto';
import { ResponseDepartmentDto } from '../../dtos/department/ResponseDepartmentDto';
import { CreateDepartmentDto } from '../../dtos/department/CreateDepartmentDto';
import { CreateServiceManagementDto } from '../../dtos/services/CreateServiceManagementDto';
import { ResponseGetDepartmentDto } from '../../dtos/department/ResponseGetDepartment';
import { UpdateDepartmentDto } from '../../dtos/department/UpdateDepartmentDto';
import { UpdateServiceManagementDto } from '../../dtos/services/UpdateServiceManagementDto';
import { ResponseGetServiceByIdDto } from '../../dtos/services/ResponseGetServiceByIdDto';
import { ResponseStatisticsDto } from '../../dtos/services/ResponseStatisticsDto';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  // Departments
  public createDepartment(department: CreateDepartmentDto): Observable<ResponseDepartmentDto> {
    return this.http.post<ResponseDepartmentDto>('http://localhost:8080/departments', department);
  }

  public updateDepartment(department: UpdateDepartmentDto): Observable<ResponseDepartmentDto> {
    return this.http.patch<ResponseDepartmentDto>('http://localhost:8080/departments', department);
  }

  public deleteDepartment(departmentId: string): Observable<ResponseDepartmentDto> {
    return this.http.delete<ResponseDepartmentDto>('http://localhost:8080/departments/' + departmentId);
  }

  public getAllDepartments(page: number, size: number, search?: string): Observable<PageResponse<ResponseDepartmentDto>> {
    return this.http.get<PageResponse<ResponseDepartmentDto>>(`http://localhost:8080/departments?page=${page}&size=${size}&search=${search}`);
  }

  public getDepartmentById(departmentId: string): Observable<ResponseGetDepartmentDto>{
    return this.http.get<ResponseGetDepartmentDto>('http://localhost:8080/departments/' + departmentId);
  }

  public getDeparmentNames(): Observable<ResponseGetDepartmentDto[]> {
    return this.http.get<ResponseGetDepartmentDto[]>('http://localhost:8080/departments/names');
  }

  public getDepartmentStatistics(): Observable<ResponseStatisticsDto> {
    return this.http.get<ResponseStatisticsDto>('http://localhost:8080/departments/statistics');
  }

  // Services
  public createServiceManagement(request: CreateServiceManagementDto): Observable<ResponseServiceManagementDto> {
    return this.http.post<ResponseServiceManagementDto>("http://localhost:8080/services", request);
  }

  public updateServiceManagement(request: UpdateServiceManagementDto): Observable<ResponseServiceManagementDto> {
    return this.http.patch<ResponseServiceManagementDto>("http://localhost:8080/services", request);
  }

  public deleteServiceManagement(request: string): Observable<ResponseServiceManagementDto> {
    return this.http.delete<ResponseServiceManagementDto>(`http://localhost:8080/services/${request}`);
  }

  public getAllServicesManagement(page: number, size: number, search?: string): Observable<PageResponse<ResponseServiceManagementDto>> {
    return this.http.get<PageResponse<ResponseServiceManagementDto>>(`http://localhost:8080/services?page=${page}&size=${size}&search=${search}`);
  }

  public getServiceManagementById(request : string): Observable<ResponseGetServiceByIdDto> {
    return this.http.get<ResponseGetServiceByIdDto>(`http://localhost:8080/services/${request}`);
  }

  public getServiceStatistics(): Observable<ResponseStatisticsDto> {
    return this.http.get<ResponseStatisticsDto>('http://localhost:8080/services/statistics');
  }
}
