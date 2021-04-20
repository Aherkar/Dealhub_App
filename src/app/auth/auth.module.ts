import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import {ResetPassword} from './login/ResetPassword.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SignupComponent, LoginComponent,ResetPassword],
  imports: [
    CommonModule,
    AuthRoutingModule,FormsModule
    ,ReactiveFormsModule
  ]
})
export class AuthModule { }
