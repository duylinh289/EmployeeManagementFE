import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { RegistryModel } from 'src/app/models/registry-model';
import { UserApiService } from 'src/app/services/user-api.service';
@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.css'],
})
export class RegistryComponent implements OnInit {
  hide = true;
  hideRep = true;
  res: any;
  constructor(private router: Router, private service: UserApiService, private appComponent:AppComponent) {}
  ngOnInit(): void {}

  Registry() {
    if (this.reactiveForm.valid) {
      this.service.registry(this.reactiveForm.value).subscribe((item) => {
        this.res = item;
        if(this.res.code == 'success')
        {
          this.appComponent.showSnackbar("Success registry account!", "Congrat!", 5000);
          this.GobackToLogin();
        }
        else{
          this.appComponent.showSnackbarError(this.res.message, "Fail", 5000);
        }
      });
    }
  }

  GobackToLogin() {
    this.router.navigate(['login']);
  }

  reactiveForm = new FormGroup({
    username: new FormControl(
      '',
      Validators.compose([
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z0-9_]*$'),
      ])
    ),
    password: new FormControl(
      '',
      Validators.compose([
        Validators.pattern(
          '^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?!.*\bw{1,}\b).{8,}$'
        ),
        Validators.required,
      ])
    ),
    passwordRep: new FormControl(
      '',
      Validators.compose([Validators.required, passwordMatchValidator])
    ),
    email: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.email])
    ),
  });
}
function passwordMatchValidator(control: FormControl) {
  const password = control.root.get('password');
  const passwordRep = control.value;

  if (password && passwordRep !== password.value) {
    return { passwordMismatch: true };
  }

  return null;
}
