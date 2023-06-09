import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response-model';
import { TaskModel } from '../models/task-model';
import { UserApiService } from './user-api.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient, private userService:UserApiService) { }

  readonly token = this.userService.GetToken();
  readonly reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.token,
  });

  getAll() : Observable<TaskModel[]> {
    return this.http.get<TaskModel[]>(
      `${environment.apiUrl}/Task/get-all`
    );
  }

  assign(req: TaskModel) : Observable<ResponseModel>{
    return this.http.post<ResponseModel>(
      `${environment.apiUrl}/Task/assign`,
      req,
      { headers: this.reqHeader }
    );
  }
}
