import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/materialmodule/materialmodule.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { CreateOBFComponent } from './dashboard/create-obf/create-obf.component';
import { ObfCreationComponent } from './obf-creation/obf-creation.component';



@NgModule({
  declarations: [DashboardComponent, CreateOBFComponent],
  declarations: [DashboardComponent, ObfCreationComponent],
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    MaterialModule,
    NgxSpinnerModule
    
  ]
})
export class DashboardModule { }
