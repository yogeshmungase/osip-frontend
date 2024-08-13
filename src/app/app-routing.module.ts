import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OsipLayoutComponent } from './osip-layout/osip-layout.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
{ 
  path: '',
  redirectTo: 'login',
  pathMatch: 'full'
},
{
  path: 'login',
  component:LoginComponent
},

{
  path: 'osip-portal',
  component:OsipLayoutComponent,
  children:[
    {
      path:'',
      redirectTo:'users',
      pathMatch: 'full'
    },
    {
      path:'',
      loadChildren:()=> import('./osip-portal/osip-portal.module').then(m=>m.OsipPortalModule)
    }
  ]
}    

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
