import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/models/message-model';
import { ChatServiceV2 } from 'src/app/services/chat-v2-service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  @Input() messages: Message[] = [];
  constructor(public chatService:ChatServiceV2) { }

  ngOnInit(): void {
  }

}
