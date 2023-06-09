import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TaskModel } from 'src/app/models/task-model';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeComponent } from '../employee/employee.component';
import { TaskService } from 'src/app/services/task.service';
import { TaskDialogComponent } from '../dialogs/task-dialog/task-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { SideNavService } from 'src/app/services/side-nav.service';

@Component({
  selector: 'app-task-assignment',
  templateUrl: './task-assignment.component.html',
  styleUrls: ['./task-assignment.component.css'],
})

export class TaskAssignmentComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'Id',
    'TaskName',
    'TaskDescription',
    'Assignee',
    'Reporter',
    'Edit',
  ];
  role = '';
  dataTasks = new MatTableDataSource<TaskModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('sidenav') public sidenav: MatDrawer;

  constructor(
    private empComponent: EmployeeComponent,
    private _taskService: TaskService,
    private dialog: MatDialog,
    private sideNavService: SideNavService,
  ) {}

  ngOnInit(): void {
    this.sideNavService.sideNavToggleSubject.subscribe(() => {
      this.sidenav.toggle();
    });

    this.role = this.empComponent.role;
    this.showTask();
  }
  ngAfterViewInit(): void {
    this.dataTasks.paginator = this.paginator;
  }

  showTask() {
    this._taskService.getAll().subscribe({
      next: (data) => {
        this.dataTasks.data = data;
      },
      error: (e) => {},
    });
  }

  assign(task: TaskModel) {
    this.dialog
      .open(TaskDialogComponent, {
        disableClose: true,
        data: task,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'assigned') {
          this.showTask();
        }
      });
  }
}
