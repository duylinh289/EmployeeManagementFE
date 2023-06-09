import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { EmployeeModel } from 'src/app/models/employee-model';
import { EmployeeApiService } from 'src/app/services/employee-api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskModel } from 'src/app/models/task-model';
import { EmployeeComponent } from '../../employee/employee.component';
import { TaskService } from 'src/app/services/task.service';
import { AppComponent } from 'src/app/app.component';
import { ChatServiceV2 } from 'src/app/services/chat-v2-service';
import { AccountModel } from 'src/app/models/account-model';
import { UserStoreServiceService } from 'src/app/services/user-store-service.service';
import { UserApiService } from 'src/app/services/user-api.service';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css'],
})
export class TaskDialogComponent implements OnInit {
  formTasks: FormGroup;
  employees: EmployeeModel[];
  userName: string = '';
  role: string = '';
  selectedUser?: string = '';

  constructor(
    private dialogRefernce: MatDialogRef<TaskDialogComponent>,
    private _employeeService: EmployeeApiService,
    private empComponent: EmployeeComponent,
    private taskService: TaskService,
    private appComponent: AppComponent,
    private chatService: ChatServiceV2,
    private _userStoreService: UserStoreServiceService,
    private _userService: UserApiService,
    @Inject(MAT_DIALOG_DATA) public tasktData: TaskModel
  ) {
    this.formTasks = new FormGroup({
      Id: new FormControl({ value: '', disabled: true }),
      TaskName: new FormControl({ value: '', disabled: true }),
      TaskDescription: new FormControl({ value: '', disabled: true }),
      Assignee: new FormControl({ value: '', disabled: false }),
      Reporter: new FormControl({ value: '', disabled: true }),
    });
  }

  ngOnInit(): void {
    this._userStoreService.getUserNameFromStore().subscribe((val) => {
      let userNameFromToken = this._userService.getUserFromToken();
      this.userName = val || userNameFromToken;
    });

    this._userStoreService.getRoleFromStore().subscribe((val) => {
      let roleFromToken = this._userService.getRoleFromToken();
      this.role = val || roleFromToken;
    });

    this.getListEmployee();

    const selectedEmployee = this.employees?.find(
      (emp) => emp.EmployeeCode == this.tasktData.Assignee
    );

    this.selectedUser = selectedEmployee?.Email;

    if (this.tasktData) {
      this.formTasks.patchValue({
        Id: this.tasktData.Id,
        TaskName: this.tasktData.TaskName,
        TaskDescription: this.tasktData.TaskDescription,
        Assignee: selectedEmployee?.EmployeeCode,
        Reporter: this.tasktData.Reporter,
      });
    }
  }

  ngOnDestroy(): void {

  }
  res: any;
  SaveAsign() {
    if (this.formTasks.valid) {
      const selectedEmployee = this.employees?.find(
        (emp) => emp.EmployeeCode == this.formTasks.value.Assignee
      );

      this.selectedUser = selectedEmployee?.Email;
      console.log('--------------- ' + this.selectedUser);

      const task: TaskModel = {
        Id: this.tasktData.Id,
        TaskName: this.tasktData.TaskName,
        TaskDescription: this.tasktData.TaskDescription,
        Assignee: this.formTasks.value.Assignee,
        AssigneeName: '',
        Reporter: this.empComponent.userName,
      };
      this.taskService.assign(task).subscribe(
        (item) => {
          this.res = item;
          if (this.res.code == 'success') {
            //Join
            this.chatService.sendPrivateMessage(
              this.selectedUser == null ? '' : this.selectedUser,
              'join to receive noti'
            );
            // send noti
            this.chatService.sendPrivateMessage(
              this.selectedUser == null ? '' : this.selectedUser,
              'You has been assigned to task: ' + this.tasktData.TaskName
            );
            //close connection
            this.chatService.closePrivateChatMessage(
              this.selectedUser == null ? '' : this.selectedUser
            );

            this.appComponent.showSnackbar(this.res.message, 'Success!', 5000);
            this.dialogRefernce.close('assigned');
          }
        },
        (error) => {
          console.log(error.error);
          this.appComponent.showSnackbarError(
            error.error,
            'Failed to assign!',
            5000
          );
        }
      );
    }
  }

  getListEmployee() {
    this._employeeService.getAllEmployee().subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: (e) => {},
    });
  }

  resF: any;
  noti() {
    this.chatService.sendPrivateMessage('linhnd', 'Task test');
  }

  joinToRoom(username: string, role: string) {
    const acc: AccountModel = {
      UserName: username,
      Role: username,
      Email: '',
    };

    console.log(this.userName);

    this.chatService.registerUser(acc).subscribe({
      next: () => {
        this.chatService.myName = acc.UserName;
      },
      error: (error) => {
        if (typeof error.error !== 'object') {
          console.log(error.error);
        }
      },
    });
  }
}
