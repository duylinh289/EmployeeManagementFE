import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Input,
} from '@angular/core';
import { EmployeeModel } from '../../models/employee-model';
import { EmployeeApiService } from '../../services/employee-api.service';
import { Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddDialogComponent } from '../dialogs/add-edit-dialog/add-edit-dialog.component';
import { AddEditEmployeeModel } from 'src/app/models/add-edit-employee-model';
import { DeleteEmployeeModel } from 'src/app/models/delete-employee-model';
import { DeleteDialogComponent } from '../dialogs/delete-dialog/delete-dialog.component';
import { AppComponent } from 'src/app/app.component';
import { UserApiService } from 'src/app/services/user-api.service';
import { UserStoreServiceService } from 'src/app/services/user-store-service.service';
import { Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { SideNavService } from 'src/app/services/side-nav.service';
import { read, utils, writeFile } from 'xlsx';
import { ImportEmployeeComponent } from '../import-employee/import-employee.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'EmployeeCode',
    'EmployeeName',
    'Email',
    'Gender',
    'DateOfBirth',
    'CreatedBy',
    'CretedOn',
    'ModifiedBy',
    'ModifiedOn',
    'Status',
    'Edit',
    'Delete',
  ];
  dataEmployee = new MatTableDataSource<EmployeeModel>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('sidenav') public sidenav: MatDrawer;

  constructor(
    private _snackbar: MatSnackBar,
    private _employeeService: EmployeeApiService,
    private dialog: MatDialog,
    private addDialog: AddDialogComponent,
    private appComponent: AppComponent,
    private _userService: UserApiService,
    private _userStoreService: UserStoreServiceService,
    private router: Router,
    private sideNavService: SideNavService
  ) {}
  res: any;
  public role: string = '';
  public userName: string = '';
  isMenuVisible = true;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataEmployee.filter = filterValue.trim().toLowerCase();
  }
  logOut() {
    this.router.navigate(['login']);
    localStorage.clear();
    this.userName = '';
    this.role = '';
  }

  showEmployee(req: string) {
    this._employeeService.searchEmployee(req == ''? 'all' : req).subscribe({
      next: (data) => {
        this.dataEmployee.data = data;
      },
      error: (e) => {},
    });
  }

  ngOnInit(): void {
    this.sideNavService.sideNavToggleSubject.subscribe(() => {
      this.sidenav.toggle();
    });

    this._userStoreService.getUserNameFromStore().subscribe((val) => {
      let userNameFromToken = this._userService.getUserFromToken();
      this.userName = val || userNameFromToken;
    });

    this._userStoreService.getRoleFromStore().subscribe((val) => {
      let roleFromToken = this._userService.getRoleFromToken();
      this.role = val || roleFromToken;
    });

    this.showEmployee('all');
  }

  ngAfterViewInit(): void {
    this.dataEmployee.paginator = this.paginator;
  }

  newEmployeeDialog(): void {
    this.dialog
      .open(AddDialogComponent, {
        disableClose: true,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'created') {
          this.showEmployee('all');
        }
      });
  }

  editEmployee(employee: AddEditEmployeeModel) {
    this.dialog
      .open(AddDialogComponent, {
        disableClose: true,
        data: employee,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'edited') {
          this.showEmployee('all');
        }
      });
  }

  deleteEmployee(employee: DeleteEmployeeModel) {
    this.dialog
      .open(DeleteDialogComponent, {
        disableClose: true,
        data: employee,
      })
      .afterClosed()
      .subscribe(
        (result) => {
          if (result === 'delete') {
            this._employeeService.deleteEmployee(employee).subscribe((item) => {
              this.res = item;
              if (this.res.code === 'Success') {
                this.appComponent.showSnackbar(
                  this.res.message,
                  'Success!',
                  5000
                );

                this.showEmployee('all');
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

  isDisabled(): boolean {
    if (this.role === 'Admin' || this.role === 'ManagerLV1') {
      return false;
    } else {
      return true;
    }
  }

  public getUsername(): string {
    return this.userName;
  }

  goToChat(): void {
    this.router.navigate(['chat']);
  }

  employeesFromFile: any[];

  handleImport($event: any) {
    const files = $event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;
        const emp: EmployeeModel[] = [];

        if (sheets.length) {
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
          let emp = rows as EmployeeModel[];
          this.dataEmployee.data = emp;
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  handleExport() {
    const headings = [
      [
        'EmployeeCode',
        'EmployeeName',
        'Email',
        'Gender',
        'DateOfBirth',
        'CreatedBy',
        'CreatedOn',
        'ModifiedBy',
        'ModifiedOn',
        'Status',
      ],
    ];
    const wb = utils.book_new();
    const ws: any = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, headings);
    utils.sheet_add_json(ws, this.dataEmployee.data, {
      origin: 'A2',
      skipHeader: true,
    });
    utils.book_append_sheet(wb, ws, 'List employees');
    writeFile(wb, 'Employees Report.xlsx');
  }

  importDialog() {
    this.dialog
      .open(ImportEmployeeComponent, {
        disableClose: true,
        height: '60%',
            width: '60%'
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'imported') {
          this.showEmployee('all');
        }
      });
  }
}
