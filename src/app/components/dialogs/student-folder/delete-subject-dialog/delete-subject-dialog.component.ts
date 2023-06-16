import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StudentModel } from 'src/app/models/student-model';
import { SubjectModel } from 'src/app/models/subject-model';

@Component({
  selector: 'app-delete-subject-dialog',
  templateUrl: './delete-subject-dialog.component.html',
  styleUrls: ['./delete-subject-dialog.component.css']
})
export class DeleteSubjectDialogComponent implements OnInit {

  constructor(private dialogReference: MatDialogRef<DeleteSubjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public subjectDelete: SubjectModel) { }

  ngOnInit(): void {
  }
  confirmDelete(){
    if (this.subjectDelete) {
      this.dialogReference.close('delete');
    }
  }

}
