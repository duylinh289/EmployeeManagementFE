import {
  Component,
  OnInit,
  Inject,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { ClassStudentModel } from 'src/app/models/class-student-model';
import { MatTableDataSource } from '@angular/material/table';
import { ClassjoinService } from 'src/app/services/student-folder/classjoin.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { StudentModel } from 'src/app/models/student-model';
import { AppComponent } from 'src/app/app.component';
import { MatPaginator } from '@angular/material/paginator';
import { ScoreCardModel } from 'src/app/models/scorecard-model';
import { ScorecardService } from 'src/app/services/student-folder/scorecard.service';
import { EditScoreDialogComponent } from './edit-score-dialog/edit-score-dialog.component';

@Component({
  selector: 'app-sccorecard-dialog',
  templateUrl: './sccorecard-dialog.component.html',
  styleUrls: ['./sccorecard-dialog.component.css'],
})
export class SccorecardDialogComponent implements OnInit {
  displayedColumns: string[] = [
    'SubjectId',
    'SubjectName',
    'RegularExam',
    'MidtermExam',
    'FinalExam',
    'AvgScore',
    'Edit',
    'Delete',
  ];
  dataSubject = new MatTableDataSource<ScoreCardModel>();
  dataSubjectOut = new MatTableDataSource<ScoreCardModel>();
  selectedSubjectId: number;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private dialogRefernce: MatDialogRef<SccorecardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public studentSearch: StudentModel,
    private appComponent: AppComponent,
    private scoreCard_Service: ScorecardService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.show();
    this.getSubjectOut();
  }

  res: any;
  delete(req: ScoreCardModel) {
    this.scoreCard_Service
      .Remove(req.SubjectId, this.studentSearch.StudentCode)
      .subscribe((x) => {
        this.res = x;
        if (this.res.code == 'success') {
          this.appComponent.showSnackbar(this.res.message, 'Success!', 5000);
          this.show();
          this.getSubjectOut();
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

  ngAfterViewInit(): void {
    this.dataSubject.paginator = this.paginator;
  }

  edit(req: ScoreCardModel) {
    req.StudentCode = this.studentSearch.StudentCode;
    this.dialog
    .open(EditScoreDialogComponent, {
      disableClose: true,
      data : req
    })
    .afterClosed()
    .subscribe((result) => {
      this.show();
      this.getSubjectOut();
    });
  }

  add() {
    this.scoreCard_Service.Registry(this.selectedSubjectId, this.studentSearch.StudentCode).subscribe((x) => {
      this.res = x;
      if (this.res.code == 'success') {
        this.appComponent.showSnackbar(
          this.res.message,
          'Success!',
          5000
        );
        this.show();
        this.getSubjectOut();
      }
      (error) => {
        console.log(error.error);
        this.appComponent.showSnackbarError(
          "Choose subject first",
          'Failed!',
          5000
        );
      };
    });
  }

  show() {
    this.scoreCard_Service
      .GetSubject(this.studentSearch.StudentCode.toString())
      .subscribe({
        next: (data) => {
          this.dataSubject.data = data;
        },
        error: (e) => {},
      });
  }

  getSubjectOut() {
    this.scoreCard_Service
      .GetSubjectOut(this.studentSearch.StudentCode.toString())
      .subscribe({
        next: (data) => {
          this.dataSubjectOut.data = data;
        },
        error: (e) => {},
      });
  }

  selectedSubject = this.dataSubject.data;
  onKey(value) {
    this.selectedSubject = this.search(value);
  }

  search(value: string) {
    let filter = value.toLowerCase();
    return this.dataSubject.data.filter((option) =>
      option.SubjectName.toLowerCase().startsWith(filter)
    );
  }
}
