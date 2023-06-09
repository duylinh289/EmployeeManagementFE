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

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLable: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-edit-dialog.component.html',
  styleUrls: ['./add-edit-dialog.component.css'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class AddDialogComponent implements OnInit {
  formEmployee: FormGroup;
  action: string = 'Add';
  actionButton: string = 'Save';
  title: string = 'Create new employee';

  constructor(
    private dialogRefernce: MatDialogRef<AddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public employeeData: AddEditEmployeeModel,
    private fb: FormBuilder,
    private _snackbar: MatSnackBar,
    private _empService: EmployeeApiService,
    private appComponent: AppComponent
  ) {
    this.formEmployee = new FormGroup({
      employeeName: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '^[AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ][aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]+ [AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ][aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]+(?: [AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ][aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]*)*'
          ),
        ])
      ),
      email: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.email])
      ),
      dateOfBirth: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          // Validators.pattern(
          //   /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\/\d{4}$/
          // ),
        ])
      ),
      gender: new FormControl('', Validators.compose([Validators.required])),
    });
  }

  ngOnInit(): void {
    if (this.employeeData) {
      console.log(this.employeeData);
      this.formEmployee.patchValue({
        employeeName: this.employeeData.EmployeeName,
        email: this.employeeData.Email,
        dateOfBirth: this.employeeData.DateOfBirth,
        gender: this.employeeData.Gender.toString() == 'true'? 'true' : 'false',
      });
      this.action = 'Edit';
      this.actionButton = 'Update';
      this.title = 'Updating employee: ' + this.employeeData.EmployeeCode;
    }
  }

  res: any;
  SaveEmployee(func: string) {
    if (func == 'Save') {
      if (this.formEmployee.valid) {
        const model: AddEditEmployeeModel = {
          EmployeeCode: generateGuid(),
          EmployeeName: this.formEmployee.value.employeeName,
          Email: this.formEmployee.value.email,
          DateOfBirth: this.formEmployee.value.dateOfBirth,
          Gender: this.formEmployee.value.gender,
        };

        this._empService.createEmployee(model).subscribe(
          (item) => {
            this.res = item;
            if (this.res.code == 'Success') {
              this.appComponent.showSnackbar(
                'Add new employee succesfully!',
                'Success!',
                5000
              );
              this.dialogRefernce.close('created');
            }
          },
          (error) => {
            console.log(error.error);
            this.appComponent.showSnackbarError(
              error.error.message,
              'Failed to create!',
              5000
            );
          }
        );
      } else {
        this.appComponent.showSnackbarError('Invalid infor', 'Fail', 5000);
      }
    } else {
      this.EditEmployee();
    }
  }

  EditEmployee() {
    if (this.formEmployee.valid) {
      const model: AddEditEmployeeModel = {
        EmployeeCode: this.employeeData.EmployeeCode,
        EmployeeName: this.formEmployee.value.employeeName,
        Email: this.formEmployee.value.email,
        DateOfBirth: this.formEmployee.value.dateOfBirth,
        Gender: this.formEmployee.value.gender,
      };

      this._empService.updateEmployee(model).subscribe(
        (item) => {
          this.res = item;
          if (this.res.code == 'Success') {
            this.appComponent.showSnackbar(
              'Update employee succesfully!',
              'Success!',
              5000
            );
            this.dialogRefernce.close('edited');
          }
        },
        (error) => {
          this.appComponent.showSnackbarError(
            error.error.message,
            'Failed to update!',
            5000
          );
        }
      );
    } else {
      this.appComponent.showSnackbarError('Invalid infor', 'Fail', 5000);
    }
  }
}
function generateGuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
