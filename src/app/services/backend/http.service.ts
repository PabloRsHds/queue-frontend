import { PageResponse } from '../../dtos/page/PageResponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseServiceManagementDto } from '../../dtos/services/ResponseServiceManagementDto';
import { ResponseDepartmentDto } from '../../dtos/department/ResponseDepartmentDto';
import { CreateDepartmentDto } from '../../dtos/department/CreateDepartmentDto';
import { CreateServiceManagementDto } from '../../dtos/services/CreateServiceManagementDto';
import { ResponseDepartmentsDto } from '../../dtos/department/ResponseDepartments';
import { ResponseGetDepartmentDto } from '../../dtos/department/ResponseGetDepartment';
import { UpdateDepartmentDto } from '../../dtos/department/UpdateDepartmentDto';
import { ResponseUpdateDepartmentDto } from '../../dtos/department/ResponseUpdateDepartmentDto';
import { UpdateServiceManagementDto } from '../../dtos/services/UpdateServiceManagementDto';
import { ResponseUpdateServiceManagementDto } from '../../dtos/services/ResponseUpdateServiceManagementDto';
import { ResponseServiceManagementsDto } from '../../dtos/services/ResponseServiceManagementsDto';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  // Departments
  createDepartment(department: CreateDepartmentDto): Observable<ResponseDepartmentDto> {
    return this.http.post<ResponseDepartmentDto>('http://localhost:8080/departments', department);
  }

  updateDepartment(department: UpdateDepartmentDto): Observable<ResponseUpdateDepartmentDto> {
    return this.http.patch<ResponseUpdateDepartmentDto>('http://localhost:8080/departments', department);
  }

  deleteDepartment(departmentId: string): Observable<void> {
    return this.http.delete<void>('http://localhost:8080/departments/' + departmentId);
  }

  public getAllDepartments(page: number, size: number, search?: string): Observable<PageResponse<ResponseDepartmentsDto>> {
    return this.http.get<PageResponse<ResponseDepartmentsDto>>(`http://localhost:8080/departments?page=${page}&size=${size}&search=${search}`);
  }

  getDepartmentById(departmentId: string): Observable<ResponseGetDepartmentDto>{
    return this.http.get<ResponseGetDepartmentDto>('http://localhost:8080/departments/' + departmentId);
  }

  // Services
  public createServiceManagement(request: CreateServiceManagementDto): Observable<ResponseServiceManagementDto> {
    return this.http.post<ResponseServiceManagementDto>("http://localhost:8080/services", request);
  }

  public updateServiceManagement(request: UpdateServiceManagementDto): Observable<ResponseUpdateServiceManagementDto> {
    return this.http.patch<ResponseUpdateServiceManagementDto>("http://localhost:8080/services", request);
  }

  public getAllServicesManagement(page: number, size: number, search?: string): Observable<PageResponse<ResponseServiceManagementsDto>> {
    return this.http.get<PageResponse<ResponseServiceManagementsDto>>(`http://localhost:8080/services?page=${page}&size=${size}&search=${search}`);
  }
}
