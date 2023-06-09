import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserApiService } from './user-api.service';
import { Observable } from 'rxjs';
import { ResponseModel } from '../models/response-model';
import { environment} from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient, private service: UserApiService) { }
  readonly token = this.service.GetToken();

  joinRoom(): Observable<ResponseModel> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.token,
    });
    return this.http.post<ResponseModel>(
      `${environment.apiUrl}/PushMessage/user`,
      null,
      { headers: reqHeader }
    );
  }

  sendMessage(mess: string): Observable<ResponseModel> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.token,
    });
    return this.http.post<ResponseModel>(
      `${environment.apiUrl}/PushMessage/push?message=${mess}`,
      null,
      { headers: reqHeader }
    );
  }

}

