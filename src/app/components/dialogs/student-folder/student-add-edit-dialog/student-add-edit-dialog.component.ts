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
import { StudentModel } from 'src/app/models/student-model';
import { StudentService } from 'src/app/services/student-folder/student.service';

@Component({
  selector: 'app-student-add-edit-dialog',
  templateUrl: './student-add-edit-dialog.component.html',
  styleUrls: ['./student-add-edit-dialog.component.css'],
})
export class StudentAddEditDialogComponent implements OnInit {
  formStudent: FormGroup;
  action: string = 'create';
  constructor(
    private dialogRefernce: MatDialogRef<StudentAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public studentData: StudentModel,
    private _studentService: StudentService,
    private appComponent: AppComponent
  ) {
    this.formStudent = new FormGroup({
      studentCode: new FormControl({ value: '', disabled: true }),
      studentName: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '^[AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ][aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]+ [AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ][aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]+(?: [AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬBCDĐEÈẺẼÉẸÊỀỂỄẾỆFGHIÌỈĨÍỊJKLMNOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢPQRSTUÙỦŨÚỤƯỪỬỮỨỰVWXYỲỶỸÝỴZ][aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz]*)*'
          ),
        ])
      ),
    });
  }

  ngOnInit(): void {
    if (this.studentData) {
      this.formStudent.patchValue({
        studentCode: this.studentData.StudentCode,
        studentName: this.studentData.StudentName,
      });
      this.action = 'Edit';
    }
  }

  res: any;
  Save() {
    if (this.formStudent.valid) {
      if (this.action == 'Edit') {
        const model: StudentModel = {
          StudentCode: this.studentData.StudentCode,
          StudentName: this.formStudent.value.studentName,
        };

        this._studentService.Update(model).subscribe((x) => {
          this.res = x;
          if (this.res.code == 'Success') {
            this.appComponent.showSnackbar(
              'Updated student succesfully!',
              'Success!',
              5000
            );
            this.dialogRefernce.close('edited');
          }
          (error) => {
            console.log(error.error);
            this.appComponent.showSnackbarError(
              error.error.message,
              'Failed to update!',
              5000
            );
          };
        });
      } else {
        const model: StudentModel = {
          StudentCode: generateGuid(),
          StudentName: this.formStudent.value.studentName,
        };

        this._studentService.Create(model).subscribe((x) => {
          this.res = x;
          if (this.res.code == 'Success') {
            this.appComponent.showSnackbar(
              'Created student succesfully!',
              'Success!',
              5000
            );
            this.dialogRefernce.close('created');
          }
          (error) => {
            console.log(error.error);
            this.appComponent.showSnackbarError(
              error.error.message,
              'Failed to create!',
              5000
            );
          };
        });
      }
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
