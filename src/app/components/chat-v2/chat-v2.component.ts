import {
  Component,
  OnInit,
  EventEmitter,
  OnDestroy,
  Output,
  Input,
  ViewChild,
} from '@angular/core';
import { AccountModel } from 'src/app/models/account-model';
import { ChatServiceV2 } from 'src/app/services/chat-v2-service';
import { UserApiService } from 'src/app/services/user-api.service';
import { UserStoreServiceService } from 'src/app/services/user-store-service.service';
import { HostListener } from '@angular/core';
import {
  Router,
  Event,
  RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationError,
  NavigationCancel,
  RoutesRecognized,
} from '@angular/router';
import { SideNavService } from 'src/app/services/side-nav.service';
import { MatDrawer } from '@angular/material/sidenav';
import { SendNotifyComponent } from '../send-notify/send-notify.component';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ResponseModel } from 'src/app/models/response-model';

@Component({
  selector: 'app-chat-v2',
  templateUrl: './chat-v2.component.html',
  styleUrls: ['./chat-v2.component.css'],
})
export class ChatV2Component implements OnInit {
  @Output() closeChatEmitter = new EventEmitter();
  @ViewChild('sidenav') public sidenav: MatDrawer;
  constructor(
    public chatService: ChatServiceV2,
    private _userService: UserApiService,
    private _userStoreService: UserStoreServiceService,
    private router: Router,
    private sideNavService: SideNavService,
    private dialog: MatDialog,
    private modalSevice: NgbModal,
    private http: HttpClient
  ) {

  }
  apiErrorMessages: string[] = [];
  userName: string;
  newTask: string;
  role: string;
  isOnl: boolean;
  assignedTasks: string[] = [];
  //@HostListener('window:popstate', ['$event'])


  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart && event.navigationTrigger === undefined) {
          this.beforereload();
      }
    });

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

    this.joinToRoom();
  }

  beforereload(){
    alert('reload')
  }

  showNotification(task: string) {
    // Hiển thị thông báo cho Quản lý
    alert(`Received new task assignment: ${task}`);
  }

  ngOnDestroy(): void {
    this.chatService.LeaveRoomChat();
    this.closeChatEmitter.emit();
  }

  backToHome() {
    // this.chatService.LeaveRoomChat();
    // this.closeChatEmitter.emit();
  }

  sendMessage(content: string) {
    this.chatService.sendMessage(content);
  }

  openPrivateChat(toUser: string) {
    const modalRef = this.modalSevice.open(SendNotifyComponent);
    modalRef.componentInstance.toUser = toUser;
  }

  res: any;
  joinToRoom() {
    //check online
    this.chatService.isOnline().subscribe(
      (x) => {
        this.res = x;
        // if (this.res.code == 'offline') {
        //   console.log();
        //   this.Join();
        // }
        // else{
        //   this.LeftRoom();
        //   this.Join();
        // }
      },
      (err) => {
        console.log(err);
      }
    );

    this.Join();

  }

  Join(){
    this.apiErrorMessages = [];

    const acc: AccountModel = {
      UserName: this.userName,
      Role: this.role,
      Email: '',
    };

    this.chatService.registerUser(acc).subscribe({
      next: () => {
        this.chatService.myName = acc.UserName;
      },
      error: (error) => {
        if (error.error == 'Please input name other'){
          console.log('-0-------------------return')
          return;
        }
        if (typeof error.error !== 'object') {
          this.apiErrorMessages.push(error.error);
        }
      },
    });

    this.chatService.JoinRoomChat();
  }

  LeftRoom(){
    this.chatService.LeaveRoomChat();
    this.closeChatEmitter.emit();
  }


}
