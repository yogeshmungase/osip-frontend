import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product/product.component';
import { EmployeeComponent,  } from './employee/employee.component';
import { ApplicationComponent } from './application/application.component';
import { ReportComponent } from './report/report.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { UsersComponent } from './users/users.component';
import { SettingsComponent } from './settings/settings.component';
import { ProjectComponent } from './project/project.component';
import { StoreComponent } from './store/store.component';
import { SupplierComponent } from './supplier/supplier.component';
import { AccountsComponent } from './accounts/accounts.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { OsipPortalRoutingModule } from './osip-routing.module';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';

import { FormsModule } from '@angular/forms'; // Import FormsModule


@NgModule({
  declarations: [
    ProductComponent,
    EmployeeComponent,
    ApplicationComponent,
    ReportComponent,
    InvoiceComponent,
    UsersComponent,
    SettingsComponent,
    ProjectComponent,
    StoreComponent,
    SupplierComponent,
    AccountsComponent,
    PurchaseComponent,
    WarehouseComponent
    // EmployyeeDialogComponent
  ],
  imports: [
    CommonModule,
    OsipPortalRoutingModule,
    MatIconModule,
    MatFormFieldModule,
    MatDialogModule,
    FormsModule
  ],

  exports: [
    PurchaseComponent, // Optionally export if it needs to be used outside this module
  
  ]
})
export class OsipPortalModule { }
