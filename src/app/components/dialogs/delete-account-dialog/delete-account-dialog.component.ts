import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccountModel } from 'src/app/models/account-model';

@Component({
  selector: 'app-delete-account-dialog',
  templateUrl: './delete-account-dialog.component.html',
  styleUrls: ['./delete-account-dialog.component.css'],
})
export class DeleteAccountDialogComponent implements OnInit {
  constructor(
    private dialogReference: MatDialogRef<DeleteAccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public accountDelete: AccountModel
  ) {}

  ngOnInit(): void {}
  confirmDelete() {
    if (this.accountDelete) {
      this.dialogReference.close('delete');
    }
  }
}
