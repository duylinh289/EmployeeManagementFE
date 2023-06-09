import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ChatServiceV2 } from 'src/app/services/chat-v2-service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-send-notify',
  templateUrl: './send-notify.component.html',
  styleUrls: ['./send-notify.component.css'],
})
export class SendNotifyComponent implements OnInit {
  @Input() toUser = '';
  constructor(
    public chatService: ChatServiceV2,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {}

  sendMessage(content: string) {
    this.chatService.sendPrivateMessage(this.toUser, content);
  }
  ngOnDestroy(): void {
    this.chatService.closePrivateChatMessage(this.toUser);
  }
}
