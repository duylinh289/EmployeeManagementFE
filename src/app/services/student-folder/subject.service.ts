import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../../models/response-model';
import { map } from 'rxjs/operators';
import { UserApiService } from '../user-api.service';
import { SubjectModel } from 'src/app/models/subject-model';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  constructor(private http: HttpClient, private service: UserApiService) { }

  readonly token = this.service.GetToken();
  readonly reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.token,
  });

  Search(req : string): Observable<SubjectModel[]>{
    return this.http.get<SubjectModel[]>(
      `${environment.apiUrl}/Subject/Search?req=${req}`
    );
  }

  Create(req: SubjectModel) : Observable<ResponseModel>{
    return this.http.post<ResponseModel>(
      `${environment.apiUrl}/Subject/Create`,
      req,
      { headers: this.reqHeader }
    );
  }

  Update(req: SubjectModel): Observable<ResponseModel>{
    return this.http.put<ResponseModel>(
      `${environment.apiUrl}/Subject/Update`,
      req,
      { headers: this.reqHeader }
    );
  }

  Delete(req : SubjectModel) : Observable<ResponseModel>{
    return this.http.put<ResponseModel>(
      `${environment.apiUrl}/Subject/Delete?id=${req.SubjectId}`, null,
      { headers: this.reqHeader }
    );
  }
}
