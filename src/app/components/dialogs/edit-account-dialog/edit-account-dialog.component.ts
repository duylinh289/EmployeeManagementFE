import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { EmployeeApiService } from 'src/app/services/employee-api.service';
import * as moment from 'moment';
import { ThisReceiver } from '@angular/compiler';
import { inject } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { AddEditEmployeeModel } from 'src/app/models/add-edit-employee-model';
import { AccountModel } from 'src/app/models/account-model';
import { UserApiService } from 'src/app/services/user-api.service';

@Component({
  selector: 'app-edit-account-dialog',
  templateUrl: './edit-account-dialog.component.html',
  styleUrls: ['./edit-account-dialog.component.css'],
})
export class EditAccountDialogComponent implements OnInit {
  formAccount: FormGroup;
  constructor(
    private dialogRefernce: MatDialogRef<EditAccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public accountData: AccountModel,
    private accService: UserApiService, private appComponent: AppComponent,
  ) {
    this.formAccount = new FormGroup({
      username: new FormControl({value: '',disabled: true}),
      email: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.email])
      ),
      role: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    if (this.accountData) {
      this.formAccount.patchValue({
        username: this.accountData.UserName,
        email: this.accountData.Email,
        role: this.accountData.Role,
      });
    }
  }
  res: any;
  SaveAccount() {
    if (this.formAccount.valid) {
      const acc: AccountModel = {
        UserName: this.accountData.UserName,
        Email: this.formAccount.value.email,
        Role: this.formAccount.value.role,
      };
      console.log(acc)
      this.accService.updateUser(acc).subscribe(
        (item) => {
          this.res = item;
          if (this.res.code == 'success') {
            this.appComponent.showSnackbar(
              'Update user succesfully!',
              'Success!',
              5000
            );
            this.dialogRefernce.close('updated');
          }
        },
        (error) => {
          console.log(error.error);
          this.appComponent.showSnackbarError(
            error.error,
            'Failed to update!',
            5000
          );
        }
      );
    }
  }
}
