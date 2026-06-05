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
import { ResponseStatisticsDto } from '../../dtos/statistics/ResponseStatisticsDto';
import { ResponseUserDto } from '../../dtos/users/ResponseUserDto';
import { ResponseAllUsersDto } from '../../dtos/users/ResponseAllUsersDto';
import { ResponseUserStatisticsDto } from '../../dtos/statistics/ResponseUserStatisticsDto';
import { RequestUserDto } from '../../dtos/users/RequestUserDto';
import { ResponseServicesForCreatedUser } from '../../dtos/services/ResponseServicesForCreatedUser';
import { ResponseUserInfoDto } from '../../dtos/users/ResponseUserInfoDto';

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

  public getServiceNamesAndDepartments(): Observable<ResponseServicesForCreatedUser[]> {
    return this.http.get<ResponseServicesForCreatedUser[]>('http://localhost:8080/services/service-for-created-user');
  }

  public getServiceStatistics(): Observable<ResponseStatisticsDto> {
    return this.http.get<ResponseStatisticsDto>('http://localhost:8080/services/statistics');
  }

  // Users
  public createUser(user: RequestUserDto): Observable<ResponseUserDto> {
    return this.http.post<ResponseUserDto>('http://localhost:8080/users', user);
  }

  public deleteUser(userId: string): Observable<ResponseUserDto> {
    return this.http.delete<ResponseUserDto>(`http://localhost:8080/users/${userId}`);
  }

  public getAllUsers(page: number, size: number, search?: string): Observable<PageResponse<ResponseAllUsersDto>> {
    return this.http.get<PageResponse<ResponseAllUsersDto>>(`http://localhost:8080/users?page=${page}&size=${size}&search=${search}`)
  }

  public getUserById(userId: string): Observable<ResponseUserInfoDto> {
    return this.http.get<ResponseUserInfoDto>(`http://localhost:8080/users/${userId}`);
  }

  public getUserStatistics(): Observable<ResponseUserStatisticsDto> {
    return this.http.get<ResponseUserStatisticsDto>('http://localhost:8080/users/statistics');
  }


}
