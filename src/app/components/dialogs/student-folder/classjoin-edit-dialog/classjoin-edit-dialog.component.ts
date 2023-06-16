import { Component, OnInit, Inject, AfterViewInit , ViewChild} from '@angular/core';
import { ClassStudentModel } from 'src/app/models/class-student-model';
import { MatTableDataSource } from '@angular/material/table';
import { ClassjoinService } from 'src/app/services/student-folder/classjoin.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StudentModel } from 'src/app/models/student-model';
import { AppComponent } from 'src/app/app.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-classjoin-edit-dialog',
  templateUrl: './classjoin-edit-dialog.component.html',
  styleUrls: ['./classjoin-edit-dialog.component.css']
})
export class ClassjoinEditDialogComponent implements OnInit {
  displayedColumns: string[] = [
    'StudentCode',
    'StudentName',
    'Delete',
  ];
  dataStudent = new MatTableDataSource<StudentModel>();
  dataStudentOut = new MatTableDataSource<StudentModel>();
  selectedStudentCode : string;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private _classjoinService: ClassjoinService, private dialogRefernce: MatDialogRef<ClassjoinEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public classSearch: ClassStudentModel, private appComponent: AppComponent) {

  }

  ngOnInit(): void {
    this.getListStudents();
    this.show();
  }

  getListStudents(){
    this._classjoinService.GetStudentOutOfClass(this.classSearch.ClassId.toString()).subscribe({
      next: (data) => {
        this.dataStudentOut.data = data;
      },
      error: (e) => {},
    });
  }

  show(){
    this._classjoinService.GetStudentOnClass(this.classSearch.ClassId.toString()).subscribe({
      next: (data) => {
        this.dataStudent.data = data;
      },
      error: (e) => {},
    });
  }

  delete(row: StudentModel){
    console.log(row)
    this._classjoinService.RemoveFromClass(this.classSearch.ClassId, row.StudentCode).subscribe((x) => {
      this.res = x;
      if (this.res.code == 'success') {
        this.appComponent.showSnackbar(
          this.res.message,
          'Success!',
          5000
        );
        this.show();
        this.getListStudents();
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

  selectedStudent = this.dataStudent.data;
  onKey(value) {
    this.selectedStudent = this.search(value);
  }

  search(value: string) {
    let filter = value.toLowerCase();
    return this.dataStudent.data.filter(option =>
      option.StudentName.toLowerCase().startsWith(filter)
    );
  }

  ngAfterViewInit(): void {
    this.dataStudent.paginator = this.paginator;
  }

  res: any;
  addstudent(){
    console.log(this.selectedStudentCode)
    this._classjoinService.AddToClass(this.classSearch.ClassId, this.selectedStudentCode).subscribe((x) => {
      this.res = x;
      if (this.res.code == 'success') {
        this.appComponent.showSnackbar(
          this.res.message,
          'Success!',
          5000
        );
        this.show();
        this.getListStudents();
      }
      (error) => {
        console.log(error.error);
        this.appComponent.showSnackbarError(
          "Choose student first",
          'Failed!',
          5000
        );
      };
    });
  }

}
