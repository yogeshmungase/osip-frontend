import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OsipService } from '../osip.service';

@Component({
  selector: 'app-osip-layout',
  templateUrl: './osip-layout.component.html',
  styleUrls: ['./osip-layout.component.css']
})
export class OsipLayoutComponent implements OnInit{
  pageTitle = 'Office Store Managment System';
  activeTab: string = 'user';
  loginData:any;

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  constructor(private router:Router,private server:OsipService){

  }
  ngOnInit(): void {
    this.loginData=this.server.getstoredData();
    console.log(this.loginData.roles)
  }
  navigateTo(route: string) {
    this.router.navigate(['/' + route]);
  }
  logout(): void {
    // this.authService.logout(); // Call the logout method from your AuthService
    this.router.navigate(['/login']); // Redirect to the login page
  }
}
// export class SidebarComponent {
//    // Set default active tab

  
//   }
// }