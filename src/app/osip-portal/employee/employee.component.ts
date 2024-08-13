import { Component, OnInit, Inject } from '@angular/core';
import { OsipService } from 'src/app/osip.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  empData: any;
  constructor(private service: OsipService, public dialog: MatDialog, private http: HttpClient) {

  }

  ngOnInit(): void {
    this.getAllEmployee();

  }

  getAllEmployee() {
    let url = 'employee/findAllEmployees';
    this.service.getFromServer(url).subscribe((resp: any) => {
      if (resp) {
        this.empData = resp;
      }
    })
  }

  addEmployyee(type: string, data: any) {

    const employyeeDialogRef = this.dialog.open(EmployyeeDialogComponent, {
      data: {
        type,
        data
      }
    });

    employyeeDialogRef.afterClosed().subscribe(result => {
      // this.fetchApplicationData(this.search,this.params.pageIndex, this.params.pageSize);
      this.getAllEmployee()
    });

  }
  

  

  deleteEmployee(employeeId: string) {
    const url = `http://localhost:8080/api/employee/delete/${employeeId}`;
    this.http.delete(url).subscribe(
      response => {
        console.log('Employee deleted successfully', response);
        // Update the empData array to reflect the deletion
        this.empData = this.empData.filter((employee: { id: string; }) => employee.id !== employeeId);
      },
      error => {
        console.error('Error deleting employee', error);
      }
    );
  }

  printEmployee(employee: any): void {
    const printContent = `
      <div>
        <h1>Employee Details</h1>
        <p><strong>Employee Name:</strong> ${employee.employeeName}</p>
        <p><strong>Email:</strong> ${employee.email}</p>
        <p><strong>Phone No:</strong> ${employee.phoneNo}</p>
        <p><strong>Date of Birth:</strong> ${employee.dob}</p>
        <p><strong>Aadhaar No:</strong> ${employee.aadhaarNo}</p>
        <p><strong>Insurance No:</strong> ${employee.insuranceNo}</p>
        <p><strong>Department Name:</strong> ${employee.departmentName}</p>
        <p><strong>Account No:</strong> ${employee.accountNo}</p>
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
    const data = document.getElementById('employee-table');
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

        doc.save('employee-data.pdf');
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
  selector: 'employee.add.update',
  templateUrl: './employee.add.update.html',
  styleUrls: ['./employee.add.update.css']
})

export class EmployyeeDialogComponent implements OnInit {
  
  employeeId: string = '';
  employeeName: string = '';
  email: string = '';
  phoneNo: string = '';
  dob: string = '';
  aadhaarNo: string = '';
  insuranceNo: string = '';
  departmentName: string = '';
  
  accountNo: string = '';
  isSignIn: boolean = true;

  employeeData: any;
  empData: any;
  constructor(private service: OsipService, public dialog: MatDialog, private router: Router, public dialogRef: MatDialogRef<EmployyeeDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  this.employeeData=data;

  }

  ngOnInit(): void {
    if (this.employeeData.type == 'update'){
      this.employeeId=this.employeeData.data.employeeId;
      this.employeeName=this.employeeData.data.employeeName;
      this.email=this.employeeData.data.email;
      this.phoneNo=this.employeeData.data.phoneNo;
      this.dob=this.employeeData.data.dob;
      this.aadhaarNo=this.employeeData.data.aadhaarNo;
      this.insuranceNo=this.employeeData.data.insuranceNo;
      this.departmentName=this.employeeData.data.departmentName;
      this.accountNo=this.employeeData.data.accountNo;
    }
  }

  
updateEmployeeData():void{
  let url ='employee/update'
  const req ={
    employeeId:this.employeeId,
    employeeName:this.employeeName,
    email:this.email,
    phoneNo:this.phoneNo,
    dob:this.dob,
    aadhaarNo:this.aadhaarNo,
    insuranceNo:this.insuranceNo,
    departmentName:this.departmentName,
    accountNo:this.accountNo
  }
  this.service.updateToServer(url, req).subscribe((resp: any) => {
    if (resp) {
      console.log(resp)
      alert('Employee Updated successfully!');
      this.dialogRef.close();
      // this.router.navigate(['/osip-portal/users']);
    }
  })
}


addEmployeeData():void{
  let url ='employee/addEmployee'
  const req ={
    employeeId:this.employeeId,
    email:this.email,
    phoneNo:this.phoneNo,
    dob:this.dob,
    aadhaarNo:this.aadhaarNo,
    insuranceNo:this.insuranceNo,
    departmentName:this.departmentName,
    accountNo:this.accountNo
  }
  this.service.postToServer(url, req).subscribe((resp: any) => {
    if (resp) {
      console.log(resp)
      alert('New Employee Added successfully!');
      this.dialogRef.close();
      // this.router.navigate(['/osip-portal/users']);
    }
  }, (error) => {
    console.error(' error:', error);
    alert(' failed To Add the Employee . Email is already taken!".');
  })
}
cancel(): void {
  // Implement cancel logic here
  this.dialogRef.close();
}
}



