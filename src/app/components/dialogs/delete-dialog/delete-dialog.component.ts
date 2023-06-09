import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeleteEmployeeModel } from 'src/app/models/delete-employee-model';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit {

  constructor(
    private dialogReference: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public employeeDelete: DeleteEmployeeModel
  ) { }

  ngOnInit(): void {
  }

  confirmDelete(){
    if(this.employeeDelete)
    {
      this.dialogReference.close("delete");
    }
  }

}
