import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-notification-popup',
  templateUrl: './notifications-popup.component.html',
  styleUrls: ['./notifications-popup.component.css'],
})
export class NotificationPopupComponent {
  public notificationSummary: string[];

  constructor(
    public dialogRef: MatDialogRef<NotificationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.notificationSummary = data.notificationSummary.split(',');
    console.log(typeof this.notificationSummary)
    console.log(this.notificationSummary)
  }
}
