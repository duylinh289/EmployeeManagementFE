import { EmployeeComponent } from '../employee/employee.component';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AppComponent } from 'src/app/app.component';
import { UserApiService } from 'src/app/services/user-api.service';
import { Router } from '@angular/router';
import { AccountModel } from 'src/app/models/account-model';
import { SideNavService } from 'src/app/services/side-nav.service';
import { MatDrawer } from '@angular/material/sidenav';
import { EditAccountDialogComponent } from '../dialogs/edit-account-dialog/edit-account-dialog.component';
import { DeleteAccountDialogComponent } from '../dialogs/delete-account-dialog/delete-account-dialog.component';
import { UserModel } from 'src/app/models/user-model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  constructor(
    public empComponent: EmployeeComponent,
    private sideNavService: SideNavService,
    private _userSerVice: UserApiService,
    private dialog: MatDialog,
    private appComponent: AppComponent
  ) {}
  @ViewChild('sidenav') public sidenav: MatDrawer;
  displayedColumns: string[] = ['Username', 'Email', 'Role', 'Edit', 'Delete'];
  dataAccount = new MatTableDataSource<AccountModel>();
  role = '';
  ngOnInit(): void {
    this.role = this.empComponent.role;
    this.sideNavService.sideNavToggleSubject.subscribe(() => {
      this.sidenav.toggle();
    });

    this.showAccount();
  }

  showAccount() {
    this._userSerVice.getAll().subscribe({
      next: (data) => {
        this.dataAccount.data = data;
      },
      error: (e) => {},
    });
  }

  editAccount(acc: AccountModel) {
    this.dialog
      .open(EditAccountDialogComponent, {
        disableClose: true,
        data: acc,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'updated') {
          this.showAccount();
        }
      });
  }
  res: any;
  deleteAccount(acc: AccountModel) {
    this.dialog
      .open(DeleteAccountDialogComponent, {
        disableClose: true,
        data: acc,
      })
      .afterClosed()
      .subscribe(
        (result) => {
          if (result === 'delete') {
            this._userSerVice.deleteUser(acc).subscribe((item) => {
              this.res = item;
              if (this.res.code === 'success') {
                this.appComponent.showSnackbar(
                  this.res.message,
                  'Success!',
                  5000
                );

                this.showAccount();
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

  search(username: string) {
    this._userSerVice.getByUserName(username).subscribe({
      next: (data) => {
        this.dataAccount.data = data;
      },
      error: (e) => {},
    });
  }
}
