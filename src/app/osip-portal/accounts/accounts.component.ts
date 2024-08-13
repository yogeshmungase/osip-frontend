


import { Component, OnInit, Inject } from '@angular/core';
import { OsipService } from 'src/app/osip.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';


import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  empData: any;
  constructor(private service: OsipService, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.getAllAccount();

  }

  getAllAccount() {
    let url = 'account/findAllAccounts';
    this.service.getFromServer(url).subscribe((resp: any) => {
      {
        if (resp) {
          // Calculate remainingQuantity for each product
          this.empData = resp.map((account: any) => ({
            ...account,
            paymentDue: account.payment - account.paymentPaid
          }));
        }
      }});
  }

  addOrUpdateAccount(type: string, data: any) {

    const accountDialogRef = this.dialog.open(AccountDialogComponent, {
      data: {
        type,
        data
      }
    });

    accountDialogRef.afterClosed().subscribe(result => {
      // this.fetchApplicationData(this.search,this.params.pageIndex, this.params.pageSize);
      this.getAllAccount()
    });

  }
  deleteAccount(accountId: string) {
    let url = `account/delete/${accountId}`;
    this.service.deleteFromServer(url).subscribe(
      response => {
        alert('Account deleted successfully!');
        this.getAllAccount();
      },
      error => {
        console.error('Error deleting account:', error);
        alert('Failed to delete account.');
      }
    );
  }

  printAccount(account: any): void {
    const printContent = `
      <div>
        <h1>Account Details</h1>
        <p><strong>Account Holder Name:</strong> ${account.accountHolderName}</p>
        <p><strong>Supplier Name:</strong> ${account.supplierName}</p>
        <p><strong>Account No:</strong> ${account.accountNo}</p>
        <p><strong>Phone No:</strong> ${account.phoneNo}</p>
        <p><strong>Email:</strong> ${account.email}</p>
        <p><strong>Total Payment:</strong> ${account.payment}</p>
        <p><strong>Payment Due:</strong> ${account.paymentDue}</p>
        <p><strong>Payment Paid:</strong> ${account.paymentPaid}</p>
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
    console.log('generatePDF called');
    const data = document.getElementById('account-table');
    if (data) {
      html2canvas(data).then(canvas => {
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        const doc = new jsPDF('p', 'mm', 'a4');
        let position = 0;

        doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        doc.save('account-data.pdf');
      }).catch(error => {
        console.error('Error generating PDF:', error);
      });
    } else {
      console.error('Table element not found.');
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
  selector: 'accounts.add.update',
  templateUrl: './accounts.add.update.html',
  styleUrls: ['./accounts.add.update.css']
})

export class AccountDialogComponent implements OnInit {
  accountId:string='';
  accountHolderName:string='';
  supplierName:string='';
  accountNo:string='';
  phoneNo:string='';
  email:string='';
  payment:string='';
  paymentDue:string='';
  paymentPaid:string='';
  isSignIn: boolean = true;
  accountData:any;
  empData: any;
  constructor(private service: OsipService, private router: Router, public dialog: MatDialog, public dialogRef: MatDialogRef<AccountDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  this.accountData=data;
  }

  ngOnInit(): void {
    if (this.accountData.type == 'update'){
      this.accountId=this.accountData.data.accountId;
      this.accountHolderName=this.accountData.data.accountHolderName;
      this.supplierName=this.accountData.data.supplierName;
      this.accountNo=this.accountData.data.accountNo;
      this.phoneNo=this.accountData.data.phoneNo;
      this.email=this.accountData.data.email;
      this.payment=this.accountData.data.payment;
      this.paymentDue=this.accountData.data.paymentDue;
      this.paymentPaid=this.accountData.data.paymentPaid;
      
    }
  }




updateAccountsData():void{
  let url ='account/update'
  const req ={
  accountId:this.accountId,
  accountHolderName:this.accountHolderName,
  supplierName:this.supplierName,
  accountNo:this.accountNo,
  phoneNo:this.phoneNo,
  email:this.email,
  payment:this.payment,
  paymentDue:this.paymentDue,
  paymentPaid:this.paymentPaid,
  }
  this.service.updateToServer(url, req).subscribe((resp: any) => {
    if(resp){
      console.log(resp)
      alert('Account Updated successfully!');
      this.dialogRef.close();
      
    }
  })
}

// updateUserData(): void {

//   let url = 'user/update'

//   const req = {
//     id: this.id,
//     email: this.email,
//     username: this.username,
//     password: this.password,
//     stringRoles: ["admin"],
//     // roles:this.roles,
//     firstName: this.firstname,
//     lastName: this.lastname,
//     phoneNo: this.phoneno,
//     address: this.address,
//     storeId: this.storeId,
//     storeName: this.storeName,
//     projectName: this.projectName,
//     gender: this.gender,
//     dob: this.dob,

//   }

//   this.service.updateToServer(url, req).subscribe((resp: any) => {
//     if (resp) {
//       console.log(resp)
//       alert('User Updated successfully!');
//       this.dialogRef.close();
//       // this.router.navigate(['/osip-portal/users']);
//     }
//   })

// }

  addAccountData(): void{
  let url ='account/addAccount'
  const req ={
  accountId:this.accountId,
  accountHolderName:this.accountHolderName,
  supplierName:this.supplierName,
  accountNo:this.accountNo,
  phoneNo:this.phoneNo,
  email:this.email,
  payment:this.payment,
  paymentDue:this.paymentDue,
  paymentPaid:this.paymentPaid,
  }
  this.service.postToServer(url, req).subscribe((resp: any) => {
    if (resp) {
      console.log(resp)
      alert('New Account Added successfully!');
      this.dialogRef.close();
      // this.router.navigate(['/osip-portal/users']);
    }
  }, (error) => {
    console.error(' error:', error);
    alert(' failed To Add the Account . Email is already taken!".');
  })
}
  

  
  cancel(): void {
    // Implement cancel logic here
     this.dialogRef.close();

}
}
