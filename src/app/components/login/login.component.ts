import { isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ResponseModel } from 'src/app/models/response-model';
import { UserModel } from 'src/app/models/user-model';
import { UserApiService } from 'src/app/services/user-api.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { UserStoreServiceService } from 'src/app/services/user-store-service.service';
import { ChatServiceV2 } from 'src/app/services/chat-v2-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  hide = true;
  constructor(
    private _service: UserApiService,
    private router: Router,
    private appComponent: AppComponent,
    private userStore: UserStoreServiceService,
    private chatService: ChatServiceV2
  ) {}

  ngOnInit(): void {
    if(localStorage.getItem('token') != ''){
      this.router.navigate(['employee'])
    }
    else{
      localStorage.clear();
    }

  }

  rsLogin: any;

  Login(acc: any) {
    if (acc.valid) {
      this._service.login(acc.value).subscribe(
        (x) => {
          this.rsLogin = x;
          if (this.rsLogin.token != '') {
            localStorage.setItem('token', this.rsLogin['message']);
            const tokenPayload = this._service.decodeToken();
            this.userStore.setUserNameForStore(tokenPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);
            this.userStore.setRoleForStore(tokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
            this.chatService.createChatConnection();
            this.router.navigate(['employee']);
          }
        },
        (err) => {
          // this.appComponent.showSnackbarError(
          //   err.error,
          //   'Not found!',
          //   5000
          // );
        }
      );
    }
  }

  GotoRegister() {
    this.router.navigate(['registry']);
  }

}
