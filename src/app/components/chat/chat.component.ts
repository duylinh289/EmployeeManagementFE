import { Component, OnInit, ViewChild } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { SideNavService } from 'src/app/services/side-nav.service';
import { MatDrawer } from '@angular/material/sidenav';
import { NgFor } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { ChatService } from 'src/app/services/chat.service';
import { AppComponent } from 'src/app/app.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  title = 'SignalRClient';
  private hubConnectionBuilder!: HubConnection;
  private user_hubConnectionBuilder!: HubConnection;
  messages: any[] = [];
  users: any[] = [];
  res: any;

  constructor(
    private sideNavService: SideNavService,
    private chatService: ChatService,
    private appComponent: AppComponent
  ) {}

  @ViewChild('sidenav') public sidenav: MatDrawer;
  ngOnInit(): void {
    this.sideNavService.sideNavToggleSubject.subscribe(() => {
      this.sidenav.toggle();
    });

    //sub messages
    this.hubConnectionBuilder = new HubConnectionBuilder()
      .withUrl(`${environment.signalRUrl}/messages`)
      .configureLogging(LogLevel.Information)
      .build();
    this.hubConnectionBuilder
      .start()
      .then(() => console.log('Connection started.......!'))
      .catch((err) => console.log('Error while connect with server'));
    this.hubConnectionBuilder.on('SendMessage', (result: any) => {
      this.messages.push(result);
    });
    //sub user joining
    this.user_hubConnectionBuilder = new HubConnectionBuilder()
      .withUrl(`${environment.signalRUrl}/users`)
      .configureLogging(LogLevel.Information)
      .build();
    this.user_hubConnectionBuilder
      .start()
      .then(() => console.log('Connection started.......!'))
      .catch((err) => console.log('Error while connect with server'));
    this.user_hubConnectionBuilder.on('SendUser', (result: any) => {
      this.users.push(result);
    });

    this.joinRoom();
  }

  joinRoom(): void {
    //join room
    this.chatService.joinRoom().subscribe(
      (x) => {
        this.res = x;
        console.log(this.res);
      },
      (err) => {
        this.appComponent.showSnackbarError(
          'Can not join room, some error occurred!',
          'Error!',
          5000
        );
      }
    );
  }
  textMess: string;
  sendMessage(mess: string) {
    this.chatService.sendMessage(mess).subscribe(
      (x) => {
        this.res = x;
        this.textMess = '';
        console.log(this.res);
      },
      (err) => {}
    );
  }
}
