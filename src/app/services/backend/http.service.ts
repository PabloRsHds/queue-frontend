import { ResponseScheduleStatisticsDto } from './../../dtos/schedule/ResponseScheduleStatisticsDto';
import { PageResponse } from '../../dtos/page/PageResponse';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
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
import { ResponseServiceNamesAndDepartments } from '../../dtos/services/ResponseServiceNamesAndDepartments';
import { ResponseUserInfoDto } from '../../dtos/users/ResponseUserInfoDto';
import { UpdateUserDto } from '../../dtos/users/UpdateUserDto';
import { ResponseAllCustomersDto } from '../../dtos/customer/ResponseAllCustomersDto';
import { ResponseCustomerInfoDto } from '../../dtos/customer/ResponseCustomerInfoDto';
import { CreateCustomerDto } from '../../dtos/customer/CreateCustomerDto';
import { ResponseCustomerDto } from '../../dtos/customer/ResponseCustomerDto';
import { UpdateCustomerDto } from '../../dtos/customer/UpdateCustomerDto';
import { ResponseAllSchedulesDto } from '../../dtos/schedule/ResponseAllSchedulesDto';
import { ResponseCustomerIdsAndNames } from '../../dtos/customer/ResponseCustomerIdsAndNames';
import { CreateScheduleDto } from '../../dtos/schedule/CreateScheduleDto';
import { ResponseScheduleDto } from '../../dtos/schedule/ResponseScheduleDto';
import { UpdateScheduleDto } from '../../dtos/schedule/UpdateScheduleDto';
import { CreateTicketDto } from '../../dtos/ticket/CreateTicketDto';
import { ResponseTicketDto } from '../../dtos/ticket/ResponseTicketDto';
import { ResponseAttendanceStatisticsDto } from '../../dtos/statistics/ResponseAttendanceStatisticsDto';
import { ResponseTicketsForAttendanceDto } from '../../dtos/attendance/ResponseTicketsForAttendanceDto';
import { ResponseTokensDto } from '../../dtos/login/ResponseTokensDto';
import { LoginDto } from '../../dtos/login/LoginDto';
import { TokensDto } from '../../dtos/login/TokensDto';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  //private readonly API_URL = 'http://192.168.25.107:8080';
  private readonly API_URL = 'http://192.168.1.4:8080';

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

  public getServiceNamesAndDepartments(): Observable<ResponseServiceNamesAndDepartments[]> {
    return this.http.get<ResponseServiceNamesAndDepartments[]>(
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

  public updateUser(user: UpdateUserDto): Observable<ResponseUserDto> {
    return this.http.patch<ResponseUserDto>(`${this.API_URL}/users`, user);
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

  // CUSTOMERS
  public registerCustomer(request: CreateCustomerDto): Observable<ResponseCustomerDto> {
    return this.http.post<ResponseCustomerDto>(`${this.API_URL}/customers`, request);
  }

  public updateCustomer(request: UpdateCustomerDto): Observable<ResponseCustomerDto> {
    return this.http.patch<ResponseCustomerDto>(`${this.API_URL}/customers`, request);
  }

  public deleteCustomer(customerId: string): Observable<ResponseCustomerDto> {
    return this.http.delete<ResponseCustomerDto>(`${this.API_URL}/customers/${customerId}`);
  }

  public getCustomerById(customerId: string): Observable<ResponseCustomerInfoDto> {
    return this.http.get<ResponseCustomerInfoDto>(`${this.API_URL}/customers/${customerId}`);
  }

  public getCustomerIdsAndNames(): Observable<ResponseCustomerIdsAndNames[]> {
    return this.http.get<ResponseCustomerIdsAndNames[]>(`${this.API_URL}/customers/ids-and-names`);
  }

  public getAllCustomers(page: number, size: number, search?: string): Observable<PageResponse<ResponseAllCustomersDto>> {
    return this.http.get<PageResponse<ResponseAllCustomersDto>>(
      `${this.API_URL}/customers?page=${page}&size=${size}&search=${search ?? ''}`
    );
  }

  // Scheduling
  public registerSchedule(request: CreateScheduleDto): Observable<ResponseScheduleDto> {
    return this.http.post<ResponseScheduleDto>(`${this.API_URL}/scheduling`, request);
  }

  public updateSchedule(request: UpdateScheduleDto): Observable<ResponseScheduleDto> {
    return this.http.patch<ResponseScheduleDto>(`${this.API_URL}/scheduling`, request);
  }

  public deleteSchedule(scheduleId: string): Observable<ResponseScheduleDto> {
    return this.http.delete<ResponseScheduleDto>(`${this.API_URL}/scheduling/`+ scheduleId)
  }

  public getAllScheduling(page: number, size: number, search?: string, scheduleDate?: string | null ): Observable<PageResponse<ResponseAllSchedulesDto>> {
    return this.http.get<PageResponse<ResponseAllSchedulesDto>>(
      `${this.API_URL}/scheduling?page=${page}&size=${size}&search=${search ?? ''}&scheduleDate=${scheduleDate ?? ''}`
    );
  }

  public getScheduleById(scheduleId: string): Observable<ResponseScheduleDto> {
    return this.http.get<ResponseScheduleDto>(`${this.API_URL}/scheduling/${scheduleId}`);
  }

  public getScheduleStatistics(): Observable<ResponseScheduleStatisticsDto> {
    return this.http.get<ResponseScheduleStatisticsDto>(`${this.API_URL}/scheduling/statistics`);
  }

  // Ticket
  public createTicket(request: CreateTicketDto): Observable<ResponseTicketDto> {
    return this.http.post<ResponseTicketDto>(`${this.API_URL}/tickets`, request);
  }

  public deleteTicket(ticketId: string): Observable<ResponseTicketDto> {
    return this.http.delete<ResponseTicketDto>(`${this.API_URL}/tickets/`+ ticketId)
  }

  public getTicketsForAttendance(): Observable<ResponseTicketsForAttendanceDto[]> {
    return this.http.get<ResponseTicketsForAttendanceDto[]>(`${this.API_URL}/tickets/tickets-for-attendance`);
  }

  // Attendance
  public getAttendanceStatistics(): Observable<ResponseAttendanceStatisticsDto> {
    return this.http.get<ResponseAttendanceStatisticsDto>(`${this.API_URL}/attendances/statistics`);
  }

  // Login
  public login(request: LoginDto): Observable<ResponseTokensDto> {
    return this.http.post<ResponseTokensDto>(`${this.API_URL}/login`, request);
  }

  public refreshTokens(tokens: TokensDto): Observable<ResponseTokensDto> {
    return this.http.post<ResponseTokensDto>(`${this.API_URL}/refresh-tokens`, tokens).pipe(

      catchError((err: HttpErrorResponse) => {

        let errorMsg = 'Serviço de refresh tokens está fora do ar';

        if (err.error?.message) {
          errorMsg = err.error.message;
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}
