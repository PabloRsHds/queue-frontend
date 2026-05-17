import { PageResponse } from './../../dtos/PageResponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseServiceManagementDto } from '../../dtos/ResponseServiceManagement';
import { ResponseDepartmentDto } from '../../dtos/ResponseDepartmentDto';
import { CreateDepartmentDto } from '../../dtos/CreateDepartmentDto';
import { CreateServiceManagementDto } from '../../dtos/CreateServiceManagement';
import { ResponseDepartmentsDto } from '../../dtos/ResponseDepartments';
import { ResponseGetDepartmentDto } from '../../dtos/ResponseGetDepartment';
import { UpdateDepartmentDto } from '../../dtos/UpdateDepartmentDto';
import { ResponseUpdateDepartmentDto } from '../../dtos/ResponseUpdateDepartmentDto';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

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

  public createServiceManagement(request: CreateServiceManagementDto): Observable<ResponseServiceManagementDto> {
    return this.http.post<ResponseServiceManagementDto>("http://localhost:8080/services", request);
  }
}
