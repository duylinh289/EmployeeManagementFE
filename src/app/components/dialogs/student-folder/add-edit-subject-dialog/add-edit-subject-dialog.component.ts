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
import { Subject } from '@microsoft/signalr';
import { SubjectModel } from 'src/app/models/subject-model';
import { SubjectService } from 'src/app/services/student-folder/subject.service';

@Component({
  selector: 'app-add-edit-subject-dialog',
  templateUrl: './add-edit-subject-dialog.component.html',
  styleUrls: ['./add-edit-subject-dialog.component.css']
})
export class AddEditSubjectDialogComponent implements OnInit {
  formSubject: FormGroup;

  action: string = 'create';
  constructor(
    private dialogRefernce: MatDialogRef<AddEditSubjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataSubject: SubjectModel,
    private _subjectSerVice: SubjectService,
    private appComponent: AppComponent
  ) {
    this.formSubject = new FormGroup({
      subjectId: new FormControl({ value: '', disabled: true }),
      subjectName: new FormControl(
        '',
        Validators.compose([
          Validators.required,
        ])
      ),
      description: new FormControl({ value: '', disabled: false }),
    });
  }

  ngOnInit(): void {
    if (this.dataSubject) {
      this.formSubject.patchValue({
        subjectId: this.dataSubject.SubjectId,
        subjectName: this.dataSubject.SubjectName,
        description: this.dataSubject.Description
      });
      this.action = 'Edit';
    }
  }

  res: any;
  Save() {
    if (this.formSubject.valid) {
      if (this.action == 'Edit') {
        const model: SubjectModel = {
          SubjectId: this.dataSubject.SubjectId,
          SubjectName: this.formSubject.value.subjectName,
          Description: this.formSubject.value.description
        };

        this._subjectSerVice.Update(model).subscribe((x) => {
          this.res = x;
          if (this.res.code == 'Success') {
            this.appComponent.showSnackbar(
              'Updated subject succesfully!',
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
        const model: SubjectModel = {
          SubjectId: 0,
          SubjectName: this.formSubject.value.subjectName,
          Description: this.formSubject.value.description
        };

        this._subjectSerVice.Create(model).subscribe((x) => {
          this.res = x;
          if (this.res.code == 'Success') {
            this.appComponent.showSnackbar(
              'Created subject succesfully!',
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
