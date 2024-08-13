import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { ProductComponent } from './product/product.component';
import { UsersComponent } from './users/users.component';
import { ProjectComponent } from './project/project.component';
import { AccountsComponent } from './accounts/accounts.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { ApplicationComponent } from './application/application.component';
import { SettingsComponent } from './settings/settings.component';
import { StoreComponent } from './store/store.component';
import { SupplierComponent } from './supplier/supplier.component';
import { ReportComponent } from './report/report.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
1
const routes: Routes = [
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'product',
    component: ProductComponent
  },

  {
    path: 'employee',
    component: EmployeeComponent
  },
  {
    path: 'project',
    component: ProjectComponent
  },
  {
    path: 'purchase',
    component: PurchaseComponent
  },
  {
    path: 'report',
    component: ReportComponent
  },
  {
    path: 'supplier',
    component: SupplierComponent
  },
  {
    path: 'store',
    component: StoreComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'application',
    component: ApplicationComponent
  },
  {
    path: 'invoice',
    component: InvoiceComponent
  },
  {
    path: 'account',
    component: AccountsComponent
  },
  {
    path: 'warehouse',
    component: WarehouseComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OsipPortalRoutingModule { }
