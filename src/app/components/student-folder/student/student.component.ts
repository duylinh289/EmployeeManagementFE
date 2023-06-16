import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { read, utils, writeFile } from 'xlsx';
import { Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserStoreServiceService } from 'src/app/services/user-store-service.service';
import { UserApiService } from 'src/app/services/user-api.service';
import { StudentModel } from 'src/app/models/student-model';
import { StudentService } from 'src/app/services/student-folder/student.service';
import { MatDialog } from '@angular/material/dialog';
import { StudentAddEditDialogComponent } from '../../dialogs/student-folder/student-add-edit-dialog/student-add-edit-dialog.component';
import { AppComponent } from 'src/app/app.component';
import { DeleteStudentDialogComponent } from '../../dialogs/student-folder/delete-student-dialog/delete-student-dialog.component';
import { SccorecardDialogComponent } from '../../dialogs/student-folder/sccorecard-dialog/sccorecard-dialog.component';
import { SeachStudentModel } from 'src/app/models/search-student-model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
})
export class StudentComponent implements OnInit {
  isMenuVisible = true;
  public role: string = '';
  public userName: string = '';

  constructor(
    private _userStoreService: UserStoreServiceService,
    private _userService: UserApiService,
    private _studentService: StudentService,
    private dialog: MatDialog,
    private appComponent: AppComponent
  ) {}

  dataStudent = new MatTableDataSource<StudentModel>();
  displayedColumns: string[] = [
    'StudentCode',
    'StudentName',
    'ClassName',
    'AvgScore',
    'Ranked',
    'CreatedBy',
    'CretedOn',
    'ModifiedBy',
    'ModifiedOn',
    'Edit',
    'Delete',
    'Subject',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('htmlData') htmlData!: ElementRef;

  ngOnInit(): void {
    this._userStoreService.getUserNameFromStore().subscribe((val) => {
      let userNameFromToken = this._userService.getUserFromToken();
      this.userName = val || userNameFromToken;
    });

    this._userStoreService.getRoleFromStore().subscribe((val) => {
      let roleFromToken = this._userService.getRoleFromToken();
      this.role = val || roleFromToken;
    });

    this.show('all');
  }

  ngAfterViewInit(): void {
    this.dataStudent.paginator = this.paginator;
  }

  handleExport() {
    const headings = [
      [
        'StudentCode',
        'StudentName',
        'ClassName',
        'AvgScore',
        'Ranked',
        'CreatedBy',
        'CretedOn',
        'ModifiedBy',
        'ModifiedOn',
      ],
    ];
    const wb = utils.book_new();
    const ws: any = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, headings);
    utils.sheet_add_json(ws, this.dataStudent.data, {
      origin: 'A2',
      skipHeader: true,
    });
    utils.book_append_sheet(wb, ws, 'List students');
    writeFile(wb, 'Student Report.xlsx');
  }

  isDisabled(): boolean {
    if (this.role === 'Admin' || this.role === 'ManagerLV1') {
      return false;
    } else {
      return true;
    }
  }

  show(req: string) {
    const reqs: SeachStudentModel = {
      Student: '',
      Class: '',
      Rank: '',
    };
    this._studentService.SearchByCondition(reqs).subscribe({
      next: (data) => {
        this.dataStudent.data = data;
      },
      error: (e) => {},
    });

    console.log(this.dataStudent.data);
  }

  edit(req: StudentModel) {
    this.dialog
      .open(StudentAddEditDialogComponent, {
        disableClose: true,
        data: req,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'edited') {
          this.show('all');
        }
      });
  }

  res: any;
  delete(req: StudentModel) {
    console.log(req);
    this.dialog
      .open(DeleteStudentDialogComponent, {
        disableClose: true,
        data: req,
      })
      .afterClosed()
      .subscribe(
        (result) => {
          if (result === 'delete') {
            this._studentService.Delete(req).subscribe((item) => {
              this.res = item;
              if (this.res.code === 'Success') {
                this.appComponent.showSnackbar(
                  this.res.message,
                  'Success!',
                  5000
                );

                this.show('all');
              }
            });
          }
        },
        (error) => {
          this.appComponent.showSnackbarError(
            error.error.message,
            'Failed to delete!',
            5000
          );
        }
      );
  }

  newDialog() {
    this.dialog
      .open(StudentAddEditDialogComponent, {
        disableClose: true,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'created') {
          this.show('all');
        }
      });
  }

  showsubject(req: StudentModel) {
    this.dialog
      .open(SccorecardDialogComponent, {
        disableClose: true,
        height: '80%',
        width: '80%',
        data: req,
      })
      .afterClosed()
      .subscribe((result) => {
        this.show('all');
      });
  }

  exportToPdf(): void {
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('angular-demo.pdf');
    });
  }
}
