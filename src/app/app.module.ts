import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OsipLayoutComponent } from './osip-layout/osip-layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import {MatCardModule} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';
import { MyInterceptorInterceptor } from './my-interceptor.interceptor';
import { LoginComponent } from './login/login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserDialogComponent } from './osip-portal/users/users.component';
import { ProjectDialogComponent } from './osip-portal/project/project.component';
import { AccountDialogComponent } from './osip-portal/accounts/accounts.component';
import { ProductDialogComponent } from './osip-portal/product/product.component';
import { EmployyeeDialogComponent } from './osip-portal/employee/employee.component';
import { StoreDialogComponent } from './osip-portal/store/store.component';
import { HttpClientModule } from '@angular/common/http';
import { WarehouseComponent, WarehouseDialogComponent } from './osip-portal/warehouse/warehouse.component';
import { OsipPortalModule } from './osip-portal/osip-portal.module';
import { PurchaseComponent,PurchaseDialogComponent } from './osip-portal/purchase/purchase.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    AppComponent,
    OsipLayoutComponent,
    LoginComponent,
    UserDialogComponent,
    ProjectDialogComponent,
    AccountDialogComponent,
    ProductDialogComponent,
    EmployyeeDialogComponent,
    EmployyeeDialogComponent,
    StoreDialogComponent,
    // WarehouseComponent,
    WarehouseDialogComponent,
    // PurchaseComponent,
    PurchaseDialogComponent
    

  ],
  imports: [
    MatMenuModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    HttpClientModule,
    FormsModule,
    
    MatIconModule,
    MatFormFieldModule,
    HttpClientModule,
    
    
    
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: MyInterceptorInterceptor,
    multi: true,
  },],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
