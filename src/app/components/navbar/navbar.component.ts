import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserApiService } from 'src/app/services/user-api.service';
import { UserStoreServiceService } from 'src/app/services/user-store-service.service';
import { SideNavService } from 'src/app/services/side-nav.service';
import { AppComponent } from 'src/app/app.component';
import { BehaviorSubject } from 'rxjs';
import { ChatServiceV2 } from 'src/app/services/chat-v2-service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NotificationPopupComponent } from '../notifications-popup/notifications-popup.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private _userService: UserApiService,
    private _userStoreService: UserStoreServiceService,
    private router: Router,
    private sideNavService: SideNavService,
    private appComponent: AppComponent,
    private chatService: ChatServiceV2,
    private dialog: MatDialog
  ) {}
  public notificationSummary: string;
  public notificationCount: BehaviorSubject<number>;
  public role: string = '';
  public userName: string = '';
  tasks: string[] = [];
  isMenuVisible = true;

  ngOnInit(): void {
    this._userStoreService.getUserNameFromStore().subscribe((val) => {
      let userNameFromToken = this._userService.getUserFromToken();
      this.userName = val || userNameFromToken;
    });

    this._userStoreService.getRoleFromStore().subscribe((val) => {
      let roleFromToken = this._userService.getRoleFromToken();
      this.role = val || roleFromToken;
    });

    this.chatService.getNotification().subscribe((task) => {
      this.tasks = task;
    });

    this.notificationCount = this.chatService.getNotificationCount();
  }

  assignTask(userId: string, task: string) {

  }

  goToChat(): void {
    this.router.navigate(['chat-v2']);
  }
  logOut() {
    this._userService.logout().subscribe((x) => {
      this.appComponent.showSnackbar('Logged out', 'Success', 3000);
      this.chatService.stopChatConnection();
    });

    this.router.navigate(['login']);
    localStorage.clear();
    this.userName = '';
    this.role = '';
  }

  clickMenu() {
    this.sideNavService.toggle();
  }

  showNotiDialog(): void {
    //clear notify
    this.chatService.getNotificationCount().next(0);

    //show noti content
    this.chatService.getNotification().subscribe((noti) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = { notificationSummary: `${noti}` };
      dialogConfig.position = { top: '64px', right: '24px' }; // Cập nhật vị trí ở đây

      const dialogRef = this.dialog.open(
        NotificationPopupComponent,
        dialogConfig
      );
    });

  }
}
