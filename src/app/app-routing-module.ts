import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './components/account/account.component';
import { ChatComponent } from './components/chat/chat.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { LoginComponent } from './components/login/login.component';
import { RegistryComponent } from './components/registry/registry.component';
import { AuthGuard } from './Guard/auth.guard';
import { ChatV2Component } from './components/chat-v2/chat-v2.component';
import { TaskAssignmentComponent } from './components/task-assignment/task-assignment.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registry', component: RegistryComponent },
  { path: 'employee', component: EmployeeComponent, canActivate:[AuthGuard] },
  { path: 'account', component: AccountComponent, canActivate:[AuthGuard] },
  { path: 'chat', component: ChatComponent, canActivate:[AuthGuard] },
  { path: 'chat-v2', component: ChatV2Component, canActivate:[AuthGuard] },
  { path: 'task', component: TaskAssignmentComponent, canActivate:[AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
