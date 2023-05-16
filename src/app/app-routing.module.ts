import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from '../app/components/chat/chat.component';
import { LoginComponent } from '../app/components/login/login.component';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { UsermanagementComponent } from './components/usermanagement/usermanagement.component';
import { QuickResponseComponent } from './components/quick-response/quick-response.component';
import {UserStateComponent } from './components/user-state/user-state.component';
import {ErrorComponent } from './components/error/error.component';
import {AuthGuardService} from "./services/auth-guard.service"

const routes: Routes = [

  {
    path: 'home',
    component: ChatComponent
  },
  {
    pathMatch: 'full',
    path: '',
    component: LoginComponent,

  },
  {
    path: 'users',
    component: UsermanagementComponent,
    canActivate : [AuthGuardService],
    // data: {role:"Admin"}
  },
   {
    path: 'profile',
    component: UserprofileComponent
  },
  {
    path: 'quick-responses',
    component: QuickResponseComponent,
    canActivate : [AuthGuardService],
    data: {role:"Admin"}

  },
  {
    path: 'users/status',
    component: UserStateComponent,
    canActivate : [AuthGuardService],
    // data: {role:"Agent"}
  },
  {
    path: 'error',
    component: ErrorComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
