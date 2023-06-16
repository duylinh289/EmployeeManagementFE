import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ValidatorFn,
  AbstractControl,
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
import { ScoreCardModel } from 'src/app/models/scorecard-model';
import { ScorecardService } from 'src/app/services/student-folder/scorecard.service';

@Component({
  selector: 'app-edit-score-dialog',
  templateUrl: './edit-score-dialog.component.html',
  styleUrls: ['./edit-score-dialog.component.css'],
})
export class EditScoreDialogComponent implements OnInit {
  formScore: FormGroup;
  constructor(
    private dialogRefernce: MatDialogRef<EditScoreDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public scoreData: ScoreCardModel,
    private scoreCard_Service: ScorecardService,
    private appComponent: AppComponent
  ) {
    this.formScore = new FormGroup({
      RegularExam: new FormControl(
        0,
        Validators.compose([Validators.required, this.validateScoreRange])
      ),
      MidtermExam: new FormControl(
        0,
        Validators.compose([Validators.required, this.validateScoreRange])
      ),
      FinalExam: new FormControl(0, Validators.compose([Validators.required, this.validateScoreRange])),
    });
  }
  validateScoreRange: ValidatorFn = (control: AbstractControl) => {
    const score = Number(control.value);
    if (score < 0 || score > 10) {
      return { scoreRange: true };
    }
    return null;
  };

  ngOnInit(): void {
    console.log(this.scoreData);
    if (this.scoreData) {
      this.formScore.patchValue({
        RegularExam: this.scoreData.RegularExam,
        MidtermExam: this.scoreData.MidtermExam,
        FinalExam: this.scoreData.FinalExam,
      });
    }
  }

  res: any;
  Save() {
    if (this.formScore.valid) {
      const req: ScoreCardModel = {
        StudentCode: this.scoreData.StudentCode,
        SubjectId: this.scoreData.SubjectId,
        RegularExam: this.formScore.value.RegularExam,
        MidtermExam: this.formScore.value.MidtermExam,
        FinalExam: this.formScore.value.FinalExam,
        SubjectName: '',
      };

      this.scoreCard_Service.EditScore(req).subscribe((x) => {
        this.res = x;
        if (this.res.code == 'success') {
          this.appComponent.showSnackbar(this.res.message, 'Success!', 5000);
          this.dialogRefernce.close('done');
        }
        (error) => {
          console.log(error.error);
          this.appComponent.showSnackbarError(
            error.error.message,
            'Failed!',
            5000
          );
        };
      });
    }
  }
}
