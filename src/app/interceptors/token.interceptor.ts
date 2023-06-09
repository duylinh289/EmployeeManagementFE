import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { UserApiService } from '../services/user-api.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { AppComponent } from '../app.component';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor( private userService:UserApiService, private router:Router,private appComponent:AppComponent) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.userService.GetToken();

    if(token){
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${token}`}
      })
    }
    return next.handle(request).pipe(
      catchError((err:any) => {
        if(err instanceof HttpErrorResponse){
          if(err.status === 401){
            this.appComponent.showSnackbarError("Token is expired, please login again!", "Warning", 5000);
            this.router.navigate(['login']);
          }
          else if(err.status === 403){
            this.appComponent.showSnackbarError("You done have permission for this action, contact to admin for more!", "Forbidden", 5000);
          }
          else if(err.status === 404){
            this.appComponent.showSnackbarError(err.error.message, "Not found!", 5000);
          }
        }
          console.log(err);
          return throwError(() => new Error("Some orther error"));
      })
    );
  }
}
