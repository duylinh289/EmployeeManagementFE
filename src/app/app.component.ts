import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  DoCheck,
} from '@angular/core';
import { EmployeeModel } from './models/employee-model';
import { EmployeeApiService } from './services/employee-api.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { Router } from '@angular/router';
import { UserStoreServiceService } from './services/user-store-service.service';
import { UserApiService } from './services/user-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements DoCheck, OnInit {
  dataEmployee = new MatTableDataSource<EmployeeModel>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private _mobileQueryListener: () => void;
  constructor(
    private router: Router,
    private matSnackBar: MatSnackBar,
    private _userStoreService: UserStoreServiceService,
    private _userService: UserApiService,
  ) {}
  showFiller = false;
  ngDoCheck(): void {
    // const currentUrl = this.router.url;
    // if (currentUrl == '/login' || currentUrl == '/') {
    //   this.isMenuVisible = false;
    // } else {
    //   this.isMenuVisible = true;
    // }
  }
  showBasicSnack(message: string, header: string) {
    this.matSnackBar.open(message, header);
  }

  ngOnInit(): void {
  }

  snackPositionTopRight(message: string, header: string, duration: number) {
    this.matSnackBar.open(message, header, {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      // direction: "rtl"
    });
  }
  showSnackbar(message: string, header: string, duration: number) {
    let snackBarColor = this.matSnackBar.open(message, header, {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snack-style'],
    });
    snackBarColor.onAction().subscribe(() => {
      snackBarColor.dismiss();
    });
  }
  showSnackbarError(message: string, header: string, duration: number) {
    let snackBarColor = this.matSnackBar.open(message, header, {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snack-style-error'],
    });
    snackBarColor.onAction().subscribe(() => {
      snackBarColor.dismiss();
    });
  }

  showSnackbarAction() {
    let snack = this.matSnackBar.open('Snackbar with action button', 'Ok');

    snack.onAction().subscribe(() => {
      alert('This will be called when snackbar Done button clicked');
    });

    snack.afterDismissed().subscribe(() => {
      alert('This will be shown after snackbar disappeared');
    });
  }
}
