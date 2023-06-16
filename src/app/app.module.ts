import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { CustomDateTimeFormatPipe } from './custom-date-time-format.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing-module';

//Marterial
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MomentDateModule } from '@angular/material-moment-adapter';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarModule,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatNativeDateModule } from '@angular/material/core';
import { LoginComponent } from './components/login/login.component';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RegistryComponent } from './components/registry/registry.component';
import { AddDialogComponent } from './components/dialogs/add-edit-dialog/add-edit-dialog.component';
import { DeleteDialogComponent } from './components/dialogs/delete-dialog/delete-dialog.component';
import { NgIf } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { MatListModule } from '@angular/material/list';
import { MediaMatcher } from '@angular/cdk/layout';
import { AccountComponent } from './components/account/account.component';
import { ChatComponent } from './components/chat/chat.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SideNavService } from './services/side-nav.service';
import { EditAccountDialogComponent } from './components/dialogs/edit-account-dialog/edit-account-dialog.component';
import { DeleteAccountDialogComponent } from './components/dialogs/delete-account-dialog/delete-account-dialog.component';
import { ChatV2Component } from './components/chat-v2/chat-v2.component';
import { MessagesComponent } from './components/messages/messages.component';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { MatBadgeModule } from '@angular/material/badge';
import { SendNotifyComponent } from './components/send-notify/send-notify.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificationPopupComponent } from './components/notifications-popup/notifications-popup.component';
import { TaskAssignmentComponent } from './components/task-assignment/task-assignment.component';
import { TaskDialogComponent } from './components/dialogs/task-dialog/task-dialog.component';
import { ImportEmployeeComponent } from './components/import-employee/import-employee.component';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { StudentComponent } from './components/student-folder/student/student.component';
import { SubjectComponent } from './components/student-folder/subject/subject.component';
import { StudentAddEditDialogComponent } from './components/dialogs/student-folder/student-add-edit-dialog/student-add-edit-dialog.component';
import { DeleteStudentDialogComponent } from './components/dialogs/student-folder/delete-student-dialog/delete-student-dialog.component';
import { AddEditSubjectDialogComponent } from './components/dialogs/student-folder/add-edit-subject-dialog/add-edit-subject-dialog.component';
import { DeleteSubjectDialogComponent } from './components/dialogs/student-folder/delete-subject-dialog/delete-subject-dialog.component';
import { ClassjoinComponent } from './components/student-folder/classjoin/classjoin.component';
import { ClassjoinEditDialogComponent } from './components/dialogs/student-folder/classjoin-edit-dialog/classjoin-edit-dialog.component';
import { SccorecardDialogComponent } from './components/dialogs/student-folder/sccorecard-dialog/sccorecard-dialog.component';
import { EditScoreDialogComponent } from './components/dialogs/student-folder/sccorecard-dialog/edit-score-dialog/edit-score-dialog.component';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeComponent,
    CustomDateTimeFormatPipe,
    LoginComponent,
    RegistryComponent,
    AddDialogComponent,
    DeleteDialogComponent,
    AccountComponent,
    ChatComponent,
    NavbarComponent,
    EditAccountDialogComponent,
    DeleteAccountDialogComponent,
    ChatV2Component,
    MessagesComponent,
    ChatInputComponent,
    SendNotifyComponent,
    NotificationPopupComponent,
    TaskAssignmentComponent,
    TaskDialogComponent,
    ImportEmployeeComponent,
    StudentComponent,
    SubjectComponent,
    StudentAddEditDialogComponent,
    DeleteStudentDialogComponent,
    AddEditSubjectDialogComponent,
    DeleteSubjectDialogComponent,
    ClassjoinComponent,
    ClassjoinEditDialogComponent,
    SccorecardDialogComponent,
    EditScoreDialogComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MomentDateModule,
    MatSnackBarModule,
    MatIconModule,
    MatDialogModule,
    MatGridListModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    MatCardModule,
    AppRoutingModule,
    MatToolbarModule,
    MatDialogModule,
    NgIf,
    MatSidenavModule,
    MatListModule,
    MatBadgeModule,
    MatTooltipModule,
    RouterModule,
    MatMenuModule,
  ],
  providers: [
    AppComponent,
    EmployeeComponent,
    AddDialogComponent,
    MatDialog,
    MediaMatcher,
    {
      provide: MatDialogRef,
      useValue: {},
    },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    SideNavService,
  ],
  bootstrap: [AppComponent],
  exports: [AppComponent, EmployeeComponent, NavbarComponent],
  entryComponents: [NotificationPopupComponent],
})
export class AppModule {}
