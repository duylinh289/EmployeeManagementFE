import { Injectable } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import { HubConnectionBuilder } from '@microsoft/signalr/dist/esm/HubConnectionBuilder';
import { HttpClient } from '@angular/common/http';
import { AccountModel } from '../models/account-model';
import { Message } from '../models/message-model';
import { environment } from '../../environments/environment';
import { UserApiService } from './user-api.service';
import { UserStoreServiceService } from 'src/app/services/user-store-service.service';
import { BehaviorSubject, async, combineLatest } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SendNotifyComponent } from '../components/send-notify/send-notify.component';
import { Observable, Subject } from 'rxjs';
import { ResponseModel } from '../models/response-model';
import { TaskNotifyModel } from '../models/task-notify-model';
//import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ChatServiceV2 {
  userName: string;
  private chatConnection?: HubConnection;
  onlineUsers: string[] = [];
  myName: string = '';
  privateMesageInitiated = false;
  messages: Message[] = [];
  privateMesages: Message[] = [];
  //private notificationSubject: Subject<string> = new Subject<string>();
  private notificationSubject: BehaviorSubject<string>[] = [];
  private notificationCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  constructor(
    private httpClient: HttpClient,
    private _userService: UserApiService,
    private _userStoreService: UserStoreServiceService,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    private http: HttpClient
  ) {
    this._userStoreService.getUserNameFromStore().subscribe((val) => {
      let userNameFromToken = this._userService.getUserFromToken();
      this.userName = val || userNameFromToken;
    });
  }

  createChatConnection() {
    this.chatConnection = new HubConnectionBuilder()
      .withUrl(`${environment.signalRUrl}/hubs/chathub`)
      .withAutomaticReconnect()
      .build();

    this.chatConnection
      .start()
      .then(() => {
        // Gọi hàm AddUserForNoti khi kết nối được thiết lập
        this.chatConnection
          ?.invoke('AddUserForNoti', this.userName)
          .then(() => {
            console.log('AddUserForNoti executed successfully.');
          })
          .catch((error) => {
            console.error('Failed to execute AddUserForNoti:', error);
          });
      })
      .catch((error) => {
        console.log(error);
      });

    // receiving commands from chathub
    this.chatConnection.on('UserConnected', () => {
      this.addUserConnectionId();
    });

    this.chatConnection.on('OnlineUsers', (onlineUsers) => {
      this.onlineUsers = [...onlineUsers];
      console.log(this.onlineUsers);
    });

    this.chatConnection.on('NewMessage', (newMessage: Message) => {
      this.messages = [...this.messages, newMessage];
    });

    this.chatConnection.on('OpenPrivate', (newMessage: Message) => {
      this.privateMesages = [...this.privateMesages, newMessage];
      this.privateMesageInitiated = true;
    });

    this.chatConnection.on('NewPrivateMessage', (newMessage: Message) => {
      console.log('đã nhận noti');
      this.privateMesages = [...this.privateMesages, newMessage];
      if (this.userName == newMessage.to) {
        this.showNotification(newMessage.content);
      }
    });

    this.chatConnection.on('ClosePrivateChat', () => {
      this.privateMesageInitiated = false;
      this.privateMesages = [];
      this.modalService.dismissAll();
    });

    this.chatConnection.on('ReceiveTaskAssignment', (task: TaskNotifyModel) => {
      this.showNotification(task.task);
    });
  }
  stopChatConnection() {
    this.chatConnection?.stop().catch((error) => console.log(error));
  }

  // Chathub method triggers comes here
  async addUserConnectionId() {
    return this.chatConnection
      ?.invoke('AddUserConnectionId', this.userName)
      .catch((error) => console.log(error));
  }

  async sendMessage(content: string) {
    const message: Message = {
      from: this.myName,
      content,
    };

    return this.chatConnection
      ?.invoke('ReceiveMessage', message)
      .catch((error) => console.log(error));
  }

  async assignTask(userId: string, task: string) {
    const task_send: TaskNotifyModel = {
      username: userId,
      task: task,
    };

    return this.chatConnection
      ?.invoke('AssignTask', task_send)
      .catch((error) => console.log(error));
  }

  registerUser(user: AccountModel) {
    return this.httpClient.post(
      `${environment.apiUrl}/Chat/register-user`,
      user,
      { responseType: 'text' }
    );
  }

  async JoinRoomChat() {
    if (!this.onlineUsers.includes(this.userName)) {
      this.sendCustomMessage(
        '',
        'leaveroom',
        this.userName + ' joined the room.'
      );

      return this.chatConnection
        ?.invoke('JoinRoomChat')
        .catch((error) => console.log(error));
    }
  }

  sendCustomMessage(from: string, to: string, content: string) {
    const message: Message = {
      from: from,
      to: to,
      content: content,
    };

    return this.chatConnection
      ?.invoke('ReceiveMessage', message)
      .catch((error) => console.log(error));
  }

  async LeaveRoomChat() {
    this.sendCustomMessage(
      '',
      'leaveroom',
      this.userName + ' has left the room.'
    );

    return this.chatConnection
      ?.invoke('LeaveRoomChat', this.userName)
      .catch((error) => console.log(error));
  }

  async sendPrivateMessage(to: string, content: string) {
    const message: Message = {
      from: this.userName,
      to,
      content,
    };

    if (!this.privateMesageInitiated) {
      this.privateMesageInitiated = true;
      return this.chatConnection
        ?.invoke('CreatePrivateChat', message)
        .then(() => {
          this.privateMesages = [...this.privateMesages, message];
        })
        .catch((error) => console.log(error));
    } else {
      return this.chatConnection
        ?.invoke('RecivePrivateMessage', message)
        .catch((error) => console.log(error));
    }
  }

  async closePrivateChatMessage(otherUser: string) {
    return this.chatConnection
      ?.invoke('RemovePrivateMessage', this.userName, otherUser)
      .catch((error) => console.log(error));
  }

  private showNotification(task: string): void {
    const currentCount = this.notificationCount.value;
    this.notificationCount.next(currentCount + 1);

    const sub = new BehaviorSubject<string>(task);
    this.notificationSubject.push(sub);
  }

  public getNotification(): Observable<string[]> {
    return combineLatest(
      this.notificationSubject.map((subject) => subject.asObservable())
    );
  }

  public getNotificationCount(): BehaviorSubject<number> {
    return this.notificationCount;
  }

  public sendNotify(): Observable<ResponseModel> {
    const task: TaskNotifyModel = {
      username: 'linhnd',
      task: 'test',
    };
    console.log(task);
    return this.http.post<ResponseModel>(
      `${environment.apiUrl}/Chat/task-assign`,
      task
    );
  }

  public isOnline():Observable<ResponseModel>{
    return this.http.get<ResponseModel>(
      `${environment.apiUrl}/Chat/checkonline?user=${this.userName}`
    );
  }

}
