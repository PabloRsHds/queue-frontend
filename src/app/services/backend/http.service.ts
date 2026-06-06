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

  private readonly API_URL = 'http://192.168.1.2:8080';

  constructor(private http: HttpClient) { }

  // Departments
  public createDepartment(department: CreateDepartmentDto): Observable<ResponseDepartmentDto> {
    return this.http.post<ResponseDepartmentDto>(`${this.API_URL}/departments`, department);
  }

  public updateDepartment(department: UpdateDepartmentDto): Observable<ResponseDepartmentDto> {
    return this.http.patch<ResponseDepartmentDto>(`${this.API_URL}/departments`, department);
  }

  public deleteDepartment(departmentId: string): Observable<ResponseDepartmentDto> {
    return this.http.delete<ResponseDepartmentDto>(`${this.API_URL}/departments/${departmentId}`);
  }

  public getAllDepartments(page: number, size: number, search?: string): Observable<PageResponse<ResponseDepartmentDto>> {
    return this.http.get<PageResponse<ResponseDepartmentDto>>(
      `${this.API_URL}/departments?page=${page}&size=${size}&search=${search ?? ''}`
    );
  }

  public getDepartmentById(departmentId: string): Observable<ResponseGetDepartmentDto> {
    return this.http.get<ResponseGetDepartmentDto>(`${this.API_URL}/departments/${departmentId}`);
  }

  public getDeparmentNames(): Observable<ResponseGetDepartmentDto[]> {
    return this.http.get<ResponseGetDepartmentDto[]>(`${this.API_URL}/departments/names`);
  }

  public getDepartmentStatistics(): Observable<ResponseStatisticsDto> {
    return this.http.get<ResponseStatisticsDto>(`${this.API_URL}/departments/statistics`);
  }

  // Services
  public createServiceManagement(request: CreateServiceManagementDto): Observable<ResponseServiceManagementDto> {
    return this.http.post<ResponseServiceManagementDto>(`${this.API_URL}/services`, request);
  }

  public updateServiceManagement(request: UpdateServiceManagementDto): Observable<ResponseServiceManagementDto> {
    return this.http.patch<ResponseServiceManagementDto>(`${this.API_URL}/services`, request);
  }

  public deleteServiceManagement(request: string): Observable<ResponseServiceManagementDto> {
    return this.http.delete<ResponseServiceManagementDto>(`${this.API_URL}/services/${request}`);
  }

  public getAllServicesManagement(page: number, size: number, search?: string): Observable<PageResponse<ResponseServiceManagementDto>> {
    return this.http.get<PageResponse<ResponseServiceManagementDto>>(
      `${this.API_URL}/services?page=${page}&size=${size}&search=${search ?? ''}`
    );
  }

  public getServiceManagementById(request: string): Observable<ResponseGetServiceByIdDto> {
    return this.http.get<ResponseGetServiceByIdDto>(`${this.API_URL}/services/${request}`);
  }

  public getServiceNamesAndDepartments(): Observable<ResponseServicesForCreatedUser[]> {
    return this.http.get<ResponseServicesForCreatedUser[]>(
      `${this.API_URL}/services/service-for-created-user`
    );
  }

  public getServiceStatistics(): Observable<ResponseStatisticsDto> {
    return this.http.get<ResponseStatisticsDto>(`${this.API_URL}/services/statistics`);
  }

  // Users
  public createUser(user: RequestUserDto): Observable<ResponseUserDto> {
    return this.http.post<ResponseUserDto>(`${this.API_URL}/users`, user);
  }

  public deleteUser(userId: string): Observable<ResponseUserDto> {
    return this.http.delete<ResponseUserDto>(`${this.API_URL}/users/${userId}`);
  }

  public getAllUsers(page: number, size: number, search?: string): Observable<PageResponse<ResponseAllUsersDto>> {
    return this.http.get<PageResponse<ResponseAllUsersDto>>(
      `${this.API_URL}/users?page=${page}&size=${size}&search=${search ?? ''}`
    );
  }

  public getUserById(userId: string): Observable<ResponseUserInfoDto> {
    return this.http.get<ResponseUserInfoDto>(`${this.API_URL}/users/${userId}`);
  }

  public getUserStatistics(): Observable<ResponseUserStatisticsDto> {
    return this.http.get<ResponseUserStatisticsDto>(`${this.API_URL}/users/statistics`);
  }
}
