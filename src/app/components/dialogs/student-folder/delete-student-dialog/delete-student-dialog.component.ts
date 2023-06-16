import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StudentModel } from 'src/app/models/student-model';

@Component({
  selector: 'app-delete-student-dialog',
  templateUrl: './delete-student-dialog.component.html',
  styleUrls: ['./delete-student-dialog.component.css']
})
export class DeleteStudentDialogComponent implements OnInit {

  constructor(private dialogReference: MatDialogRef<DeleteStudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public studentDelete: StudentModel) { }

  ngOnInit(): void {
  }

  confirmDelete(){
    if (this.studentDelete) {
      this.dialogReference.close('delete');
    }
  }
}
