import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response-model';
import { UserModel } from '../models/user-model';
import { RegistryModel } from '../models/registry-model';
import {JwtHelperService} from '@auth0/angular-jwt';
import { AccountModel } from '../models/account-model';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private userPayload:any;
  constructor(private http: HttpClient) {
    this.userPayload = this.decodeToken();
  }

  readonly reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.GetToken(),
  });

  public login(req: Observable<any>): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(
      `${environment.apiUrl}/User/login`,
      req
    );
  }

  public logout() : Observable<ResponseModel>{
    return this.http.post<ResponseModel>(
      `${environment.apiUrl}/User/logout`,
      null
    );
  }

  public registry(req: any): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(
      `${environment.apiUrl}/User/register`,
      req
    );
  }

  public IsLogedIn() {
    return localStorage.getItem('token') != null;
  }

  public GetToken() {
    return localStorage.getItem('token') != null
      ? localStorage.getItem('token')
      : '';
  }

  decodeToken(){
    const jwtHelper = new JwtHelperService
    const token = this.GetToken()!;
    console.log(jwtHelper.decodeToken(token));
    return jwtHelper.decodeToken(token);
  }

  getUserFromToken(){
    if(this.userPayload){
      const username = this.userPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
      return username;
    }
  }

  getRoleFromToken(){
    if(this.userPayload){
      return this.userPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    }
  }

  getAll():Observable<AccountModel[]>{
    return this.http.get<AccountModel[]>(
      `${environment.apiUrl}/User/getall`, { headers: this.reqHeader }
    );
  }

  updateUser(acc: AccountModel):Observable<ResponseModel>{
    return this.http.post<ResponseModel>(
      `${environment.apiUrl}/User/update`, acc,{ headers: this.reqHeader }
    );
  }

  deleteUser(acc: AccountModel):Observable<ResponseModel>{
    return this.http.put<ResponseModel>(
      `${environment.apiUrl}/User/delete`, acc,{ headers: this.reqHeader }
    );
  }

  getByUserName(username: string): Observable<AccountModel[]>{
    return this.http.get<AccountModel[]>(
      `${environment.apiUrl}/User/get-user?username=${username}`, { headers: this.reqHeader }
    );
  }
}
