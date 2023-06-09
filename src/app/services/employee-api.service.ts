import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EmployeeModel } from '../models/employee-model';
import { ResponseModel } from '../models/response-model';
import { map } from 'rxjs/operators';
import { UserApiService } from './user-api.service';
import { AddEditEmployeeModel } from '../models/add-edit-employee-model';
import { DeleteEmployeeModel } from '../models/delete-employee-model';
import { ImportEmployeeModel } from '../models/import-employee-models';

@Injectable({
  providedIn: 'root',
})
export class EmployeeApiService {
  constructor(private http: HttpClient, private service: UserApiService) {}

  readonly token = this.service.GetToken();
  readonly reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.token,
  });

  getAllEmployee(): Observable<EmployeeModel[]> {
    return this.http.get<EmployeeModel[]>(
      `${environment.apiUrl}/Employee/GetAll`
    );
  }

  searchEmployee(req: string): Observable<EmployeeModel[]> {
    return this.http.get<EmployeeModel[]>(
      `${environment.apiUrl}/Employee/Search?req=${req}`
    );
  }

  getEmployeeById(id: string): Observable<EmployeeModel> {
    return this.http.get<EmployeeModel>(
      `${environment.apiUrl}/Employee/GetById/${id}`
    );
  }

  createEmployee(req: AddEditEmployeeModel): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(
      `${environment.apiUrl}/Employee/Create`,
      req,
      { headers: this.reqHeader }
    );
  }

  updateEmployee(req: AddEditEmployeeModel): Observable<ResponseModel> {
    return this.http.put<ResponseModel>(
      `${environment.apiUrl}/Employee/Update`,
      req,
      { headers: this.reqHeader }
    );
  }

  deleteEmployee(req: DeleteEmployeeModel): Observable<ResponseModel> {
    return this.http.put<ResponseModel>(
      `${environment.apiUrl}/Employee/Delete?id=${req.EmployeeCode}`, null,
      { headers: this.reqHeader }
    );
  }

  checkDataImport(req: any): Observable<ImportEmployeeModel[]>{
    return this.http.post<ImportEmployeeModel[]>(
      `${environment.apiUrl}/Employee/Check-import`, req,
      { headers: this.reqHeader }
    );
  }

  saveImport(req: ImportEmployeeModel[]): Observable<ResponseModel>{
    return this.http.post<ResponseModel>(
      `${environment.apiUrl}/Employee/Save-import`, req,
      { headers: this.reqHeader }
    );
  }
}
