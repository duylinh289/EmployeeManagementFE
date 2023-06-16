import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../../models/response-model';
import { map } from 'rxjs/operators';
import { UserApiService } from '../user-api.service';
import { StudentModel } from 'src/app/models/student-model';
import { SeachStudentModel } from 'src/app/models/search-student-model';
@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient, private service: UserApiService) { }

  readonly token = this.service.GetToken();
  readonly reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.token,
  });

  Search(req : string): Observable<StudentModel[]>{
    return this.http.get<StudentModel[]>(
      `${environment.apiUrl}/Students/Search?req=${req}`
    );
  }

  SearchByCondition(req : SeachStudentModel): Observable<StudentModel[]>{
    return this.http.post<StudentModel[]>(
      `${environment.apiUrl}/Students/SearchByCondition`, req
    );
  }

  Create(req: StudentModel) : Observable<ResponseModel>{
    return this.http.post<ResponseModel>(
      `${environment.apiUrl}/Students/Create`,
      req,
      { headers: this.reqHeader }
    );
  }

  Update(req: StudentModel): Observable<ResponseModel>{
    return this.http.put<ResponseModel>(
      `${environment.apiUrl}/Students/Update`,
      req,
      { headers: this.reqHeader }
    );
  }

  Delete(req : StudentModel) : Observable<ResponseModel>{
    return this.http.put<ResponseModel>(
      `${environment.apiUrl}/Students/Delete?id=${req.StudentCode}`, null,
      { headers: this.reqHeader }
    );
  }
}
