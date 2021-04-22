import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/materialmodule/materialmodule.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { CreateOBFComponent } from './dashboard/create-obf/create-obf.component';
import { NgxDropzoneModule } from 'ngx-dropzone';




@NgModule({
  declarations: [DashboardComponent, CreateOBFComponent],
 
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    MaterialModule,
    NgxSpinnerModule,
    NgxDropzoneModule
    
  ]
})
export class DashboardModule { }
