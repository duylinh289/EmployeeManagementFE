import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
import { SubjectService } from 'src/app/services/student-folder/subject.service';
import { SubjectModel } from 'src/app/models/subject-model';
import { DeleteSubjectDialogComponent } from '../../dialogs/student-folder/delete-subject-dialog/delete-subject-dialog.component';
import { AddEditSubjectDialogComponent } from '../../dialogs/student-folder/add-edit-subject-dialog/add-edit-subject-dialog.component';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css'],
})
export class SubjectComponent implements OnInit {
  isMenuVisible = true;
  public role: string = '';
  public userName: string = '';
  dataSubject = new MatTableDataSource<SubjectModel>();
  displayedColumns: string[] = [
    'SubjectId',
    'SubjectName',
    'Description',
    'CreatedBy',
    'CretedOn',
    'ModifiedBy',
    'ModifiedOn',
    'Edit',
    'Delete',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _userStoreService: UserStoreServiceService,
    private _userService: UserApiService,
    private _subjectService: SubjectService,
    private dialog: MatDialog,
    private appComponent: AppComponent
  ) {}

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

  handleExport() {
    const headings = [
      [
        'SubjectId',
        'SubjectName',
        'Description',
        'CreatedBy',
        'CretedOn',
        'ModifiedBy',
        'ModifiedOn',
      ],
    ];
    const wb = utils.book_new();
    const ws: any = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, headings);
    utils.sheet_add_json(ws, this.dataSubject.data, {
      origin: 'A2',
      skipHeader: true,
    });
    utils.book_append_sheet(wb, ws, 'List Subject');
    writeFile(wb, 'Subject Report.xlsx');
  }

  isDisabled(): boolean {
    if (this.role === 'Admin' || this.role === 'ManagerLV1') {
      return false;
    } else {
      return true;
    }
  }

  ngAfterViewInit(): void {
    this.dataSubject.paginator = this.paginator;
  }

  show(req: string) {
    this._subjectService.Search(req == '' ? 'all' : req).subscribe({
      next: (data) => {
        this.dataSubject.data = data;
      },
      error: (e) => {},
    });
  }

  edit(req: SubjectModel) {
    this.dialog
      .open(AddEditSubjectDialogComponent, {
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
  delete(req: SubjectModel) {
    console.log(req);
    this.dialog
      .open(DeleteSubjectDialogComponent, {
        disableClose: true,
        data: req,
      })
      .afterClosed()
      .subscribe(
        (result) => {
          if (result === 'delete') {
            this._subjectService.Delete(req).subscribe((item) => {
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
      .open(AddEditSubjectDialogComponent, {
        disableClose: true,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'created') {
          this.show('all');
        }
      });
  }
}
