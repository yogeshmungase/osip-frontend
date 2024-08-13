import { Component, OnInit, Inject } from '@angular/core';
import { OsipService } from 'src/app/osip.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  empData: any;
  constructor(private service: OsipService, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    let url = 'user/findAllUsers';
    this.service.getFromServer(url).subscribe((resp: any) => {
      if (resp) {
        this.empData = resp;
      }
    })
  }

  addOrUpdateUser(type: string, data: any) {

    const userDialogRef = this.dialog.open(UserDialogComponent, {
      data: {
        type,
        data
      }
    });

    userDialogRef.afterClosed().subscribe(result => {
      // this.fetchApplicationData(this.search,this.params.pageIndex, this.params.pageSize);
      this.getAllUsers()
    });


  }
  deleteUser(user: any) {
    if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
      let url = `user/delete/${user.id}`;
      this.service.deleteFromServer(url).subscribe(
        response => {
          alert('User deleted successfully!');
          this.getAllUsers();
        },
        error => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user.');
        }
      );
    }
  }
  printUser(user: any): void {
    const printContent = `
      <div>
        <h1>User Details</h1>
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>First Name:</strong> ${user.firstName}</p>
        <p><strong>Last Name:</strong> ${user.lastName}</p>
        <p><strong>Date of Birth:</strong> ${user.dob}</p>
        <p><strong>Phone Number:</strong> ${user.phoneNo}</p>
        <p><strong>Address:</strong> ${user.address}</p>
        <p><strong>Gender:</strong> ${user.gender}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Store ID:</strong> ${user.storeId}</p>
        <p><strong>Store Name:</strong> ${user.storeName}</p>
        <p><strong>Project Name:</strong> ${user.projectName}</p>
        <p><strong>Role:</strong> ${user.roles[0]?.name}</p>
      </div>
    `;
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  }

  generatePDF() {
    const data = document.getElementById('user-table');
    if (data) {
      html2canvas(data).then(canvas => {
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const heightLeft = imgHeight;
        const doc = new jsPDF('p', 'mm', 'a4');
        let position = 0;

        doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        position = heightLeft - pageHeight;

        while (position >= 0) {
          doc.addPage();
          doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
          position -= pageHeight;
        }

        doc.save('user-data.pdf');
      });
    }
  }
  generateExcel() {
    console.log('generateExcel function called'); // Debugging statement
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.empData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'user-data.xlsx');
  }
  
}


@Component({
  selector: 'update-users',
  templateUrl: './users.add.update.html',
  styleUrls: ['./users.add.update.css']
})

export class UserDialogComponent implements OnInit {
  id: string = '';
  username: string = '';
  password: string = '';
  email: string = '';
  // roles: string ='';
  roles: any = [];
  firstname: string = '';
  lastname: string = '';
  phoneno: string = '';
  address: string = '';
  storeId: string = '';
  storeName: string = '';
  projectName: string = '';
  gender: string = '';
  dob: string = '';

  isSignIn: boolean = true;

  userData: any;
  empData: any;
  storeData: any;
  user: any
  constructor(private service: OsipService, private router: Router, public dialog: MatDialog, public dialogRef: MatDialogRef<UserDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data)
    this.userData = data;
  }


  ngOnInit(): void {
    // get Store deatils and map tpo storeData
    this.getStoreDetails();
    if (this.userData.type == 'update') {
      this.id = this.userData.data.id;
      this.username = this.userData.data.username;
      this.password = this.userData.data.password;
      this.email = this.userData.data.email;
      this.roles = this.userData.data.roles;

      this.firstname = this.userData.data.firstName;
      this.lastname = this.userData.data.lastName;

      this.phoneno = this.userData.data.phoneNo;
      this.address = this.userData.data.address;

      this.storeId = this.userData.data.storeId;
      this.storeName = this.userData.data.storeName;

      this.projectName = this.userData.data.projectName;
      this.gender = this.userData.data.gender;
      this.dob = this.userData.data.dob;
    }

  }

  getStoreDetails(): void {

    let url = 'store/findAllStore'
    this.service.getFromServer(url).subscribe((resp: any) => {
      if (resp) {
        this.storeData = resp;
      }
    })

  }

  setStoreAndProjectDetails(record: Event): void {
    console.log(record)
    const target = record.target as HTMLSelectElement;
    const array = target.value.split(" ");
    const selectedValue = array[1];
    this.storeData.forEach((element: any) => {
      if (element.storeId == selectedValue) {
        this.storeId = element.storeId;
        this.storeName = element.storeName;
        this.projectName = element.projectName;
      }
    });

  }

  updateUserData(): void {

    let url = 'user/update'

    const req = {
      id: this.id,
      email: this.email,
      username: this.username,
      password: this.password,
      stringRoles: ["admin"],
      // roles:this.roles,
      firstName: this.firstname,
      lastName: this.lastname,
      phoneNo: this.phoneno,
      address: this.address,
      storeId: this.storeId,
      storeName: this.storeName,
      projectName: this.projectName,
      gender: this.gender,
      dob: this.dob,

    }

    this.service.updateToServer(url, req).subscribe((resp: any) => {
      if (resp) {
        console.log(resp)
        alert('User Updated successfully!');
        this.dialogRef.close();
        // this.router.navigate(['/osip-portal/users']);
      }
    })

  }



  addUserData(): void {
    let url = 'user/addUser'
    const req = {
      email: this.email,
      username: this.username,
      password: this.password,
      roles: ["admin"],
      // roles:this.roles,
      firstName: this.firstname,
      lastName: this.lastname,
      phoneNo: this.phoneno,
      address: this.address,
      storeId: this.storeId,
      storeName: this.storeName,
      projectName: this.projectName,
      gender: this.gender,
      dob: this.dob,

    }

    this.service.postToServer(url, req).subscribe((resp: any) => {
      if (resp) {
        console.log(resp)
        alert('New User Added successfully!');
        this.dialogRef.close();
        // this.router.navigate(['/osip-portal/users']);
      }
    }, (error) => {
      console.error('Registration error:', error);
      alert('Registration failed. Username Or Email is already taken!".');
    })
  }

  cancel(): void {
    // Implement cancel logic here, such as resetting form fields or navigating away
    this.dialogRef.close();
  }
  // deleteUser(user: string, data: any): void {
  //   if (resp) {
  //     let url = `user/delete/${user.id}`;
  //     this.service.deleteFromServer(url).subscribe(
  //       response => {
  //         alert('User deleted successfully!');
  //         this.getAllUsers();
  //       },
  //       error => {
  //         console.error('Error deleting user:', error);
  //         alert('Failed to delete user.');
  //       }
  //     );
  //   }
  // }

  

}








