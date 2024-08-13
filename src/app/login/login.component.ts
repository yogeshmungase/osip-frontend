import { Component } from '@angular/core';
import { OsipService } from '../osip.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  // roles: string ='';
  roles: any = [];
  firstname: string = '';
  lastname: string = '';
  phoneno: string = '';
  address: string ='';
  storeId: string ='';
  storeName: string ='';
  projectName: string ='';
  gender: string ='';
  dob: string ='';
  
  isSignIn: boolean = true;
  constructor(private service: OsipService,
    private router: Router) {

  }

  ngOnInit(): void {

  }

  login() {
    let url = 'auth/signin'
    let req = {
      username: this.username,
      password: this.password
    }
    
    this.service.postToServer(url, req).subscribe((resp: any) => {
      if(resp){
        console.log(resp)
        this.setstoredData(resp)
        
        this.router.navigate(['/osip-portal/users']);
      }
      
    },(error) => {
      console.error('Login error:', error);
      alert('Login failed. Please check your username and password.'); // Alert message for login failure
    })
  }

  register() {
    let url = 'auth/signup'
    const req = {
      email: this.email,
      username: this.username,
      password: this.password,
      roles: ["storemanager"],
      // roles:this.roles,
      firstName: this.firstname,
      lastName: this.lastname,
      phoneNo: this.phoneno,
      address: this.address,
      storeId:this.storeId,
      storeName:this.storeName,
      projectName:this.projectName,
      gender: this.gender,
      dob: this.dob,
     

    }

    this.service.postToServer(url, req).subscribe((resp: any) => {
      this.isSignIn = true
    },(error) => {
      console.error('Registration error:', error);
      alert('Registration failed. Username Or Email is already taken!".'); // Alert message for registration failure
    })
  }
 setstoredData(data:any){
 const values = {
  id : data?.id,
  username: data?.username,
  email: data?.email,
  roles:data?.roles
 }
 sessionStorage.setItem("data", JSON.stringify(values));
 }
 
}
