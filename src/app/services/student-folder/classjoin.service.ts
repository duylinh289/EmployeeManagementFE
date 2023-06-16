import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../../models/response-model';
import { map } from 'rxjs/operators';
import { UserApiService } from '../user-api.service';
import { ClassStudentModel } from 'src/app/models/class-student-model';
import { StudentModel } from 'src/app/models/student-model';

@Injectable({
  providedIn: 'root'
})
export class ClassjoinService {

  constructor(private http: HttpClient, private service: UserApiService) { }

  readonly token = this.service.GetToken();
  readonly reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.token,
  });

  Search(req : string): Observable<ClassStudentModel[]>{
    return this.http.get<ClassStudentModel[]>(
      `${environment.apiUrl}/ClassStudent/Search?keyword=${req}`
    );
  }

  GetStudentOnClass(classid : string):Observable<StudentModel[]>{
    return this.http.get<StudentModel[]>(
      `${environment.apiUrl}/ClassStudent/GetStudent?classid=${classid}`
    );
  }

  AddToClass(classid: number, studentcode: string): Observable<ResponseModel>{
    return this.http.post<ResponseModel>(
      `${environment.apiUrl}/ClassStudent/AddStudent?classid=${classid}&studentid=${studentcode}`, null,
      { headers: this.reqHeader }
    );
  }

  RemoveFromClass(classid: number, studentcode: string) : Observable<ResponseModel>{
    return this.http.post<ResponseModel>(
      `${environment.apiUrl}/ClassStudent/RemoveStudent?classid=${classid}&studentid=${studentcode}`, null,
      { headers: this.reqHeader }
    );
  }

  GetStudentOutOfClass(classid : string):Observable<StudentModel[]>{
    return this.http.get<StudentModel[]>(
      `${environment.apiUrl}/ClassStudent/GetStudentOut?classid=${classid}`
    );
  }
}
