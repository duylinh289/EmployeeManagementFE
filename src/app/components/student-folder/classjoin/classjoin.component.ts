import { Component, OnInit , ViewChild, AfterViewInit} from '@angular/core';
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
import { ClassStudentModel } from 'src/app/models/class-student-model';
import { ClassjoinService } from 'src/app/services/student-folder/classjoin.service';
import { ClassjoinEditDialogComponent } from '../../dialogs/student-folder/classjoin-edit-dialog/classjoin-edit-dialog.component';

@Component({
  selector: 'app-classjoin',
  templateUrl: './classjoin.component.html',
  styleUrls: ['./classjoin.component.css'],
})
export class ClassjoinComponent implements OnInit {
  isMenuVisible = true;
  public role: string = '';
  public userName: string = '';
  dataClasses = new MatTableDataSource<ClassStudentModel>();
  displayedColumns: string[] = [
    'ClassId',
    'ClassName',
    'Description',
    'Grade',
    'CountStudents',
    'Edit',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private appComponent: AppComponent,
    private _classjoinService: ClassjoinService,
    private _userStoreService: UserStoreServiceService,
    private _userService: UserApiService
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

  ngAfterViewInit(): void {
    this.dataClasses.paginator = this.paginator;
  }

  isDisabled(): boolean {
    if (this.role === 'Admin' || this.role === 'ManagerLV1') {
      return false;
    } else {
      return true;
    }
  }
  show(req: string) {
    this._classjoinService.Search(req == '' ? 'all' : req).subscribe({
      next: (data) => {
        this.dataClasses.data = data;
      },
      error: (e) => {},
    });
  }

  edit(req: ClassStudentModel) {
    this.dialog
      .open(ClassjoinEditDialogComponent, {
        disableClose: true,
        height: '60%',
        width: '60%',
        data: req,
      })
      .afterClosed()
      .subscribe((result) => {
        this.show('all');
      });
  }
}
