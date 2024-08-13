
import { Component, OnInit, Inject } from '@angular/core';
import { OsipService } from 'src/app/osip.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  empData: any;
  constructor(private service: OsipService, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.getAllStore();

  }

  getAllStore() {
    let url = 'store/findAllStore';
    this.service.getFromServer(url).subscribe((resp: any) => {
      if (resp) {
        this.empData = resp;
      }
    })
  }

  addOrUpdateStore(type: string, data: any) {

    const storeDialogRef = this.dialog.open(StoreDialogComponent, {
      data: {
        type,
        data
      }
    });

    storeDialogRef.afterClosed().subscribe(result => {
      // this.fetchApplicationData(this.search,this.params.pageIndex, this.params.pageSize);
      this.getAllStore()
    });

  }
  
  deleteStore(storeId: string) {
    let url = `store/delete/${storeId}`;
    this.service.deleteFromServer(url).subscribe(
      response => {
        alert('Store deleted successfully!');
        this.getAllStore();
      },
      error => {
        console.error('Error deleting store:', error);
        alert('Failed to delete store.');
      }
    );
  }

  printStore(store: any): void {
    const printContent = `
      <div>
        <h1>User Details</h1>
        <p><strong>Store ID:</strong> ${store.storeId}</p>
        <p><strong>Store Name:</strong> ${store.storeName}</p>
        <p><strong>Project Name</strong> ${store.projectName}</p>
        <p><strong>Store Location:</strong> ${store.storeLocation}</p>
        <p><strong>Manager Name:</strong> ${store.storeManagerName}</p>
        <p><strong>Manager Phone No:</strong> ${store.managerPhoneNo}</p>
        <p><strong>Project Status:</strong> ${store.projectStatus}</p>
        
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
    const data = document.getElementById('store-table');
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

        doc.save('store-data.pdf');
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
  selector: 'store.add.update',
  templateUrl: './store.add.update.html',
  styleUrls: ['./store.add.update.css']
})

export class StoreDialogComponent implements OnInit {
  storeId: string = '';
  storeName: string = '';
  projectName: string = '';
  storeLocation: string = '';
  storeManagerName: string = '';
  managerPhoneNo: string = '';
  projectStatus: string = '';
  isSignIn: boolean = true;

  storeData: any;
  empData: any;
  constructor(private service: OsipService, public dialog: MatDialog, private router: Router, public dialogRef: MatDialogRef<StoreDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.storeData = data;
  }

  ngOnInit(): void {
    if (this.storeData.type == 'update') {
      this.storeId = this.storeData.data.storeId;
      this.storeName = this.storeData.data.storeName;
      this.projectName = this.storeData.data.projectName;
      this.storeLocation = this.storeData.data.storeLocation;
      this.storeManagerName = this.storeData.data.storeManagerName;
      this.managerPhoneNo = this.storeData.data.managerPhoneNo;
      this.projectStatus = this.storeData.data.projectStatus;
    }
  }

  updateStoreData(): void {
    let url = 'store/update'
    const req = {
      storeId: this.storeId,
      storeName: this.storeName,
      projectName: this.projectName,
      storeLocation: this.storeLocation,
      storeManagerName: this.storeManagerName,
      managerPhoneNo: this.managerPhoneNo,
      projectStatus: this.projectStatus
    }
    this.service.updateToServer(url, req).subscribe((resp: any) => {
      if (resp) {
        console.log(resp)
        alert(' Store Updated successfully!');
        this.dialogRef.close();
        // this.router.navigate(['/osip-portal/users']);
      }
    })
  }

  addStoreData(): void {
    let url = 'store/addStore'
    const req = {
      storeId: this.storeId,
      storeName: this.storeName,
      projectName: this.projectName,
      storeLocation: this.storeLocation,
      storeManagerName: this.storeManagerName,
      managerPhoneNo: this.managerPhoneNo,
      projectStatus: this.projectStatus
    }
    this.service.postToServer(url, req).subscribe((resp: any) => {
      if (resp) {
        console.log(resp)
        alert('New Store Added successfully!');
        this.dialogRef.close();
        // this.router.navigate(['/osip-portal/users']);
      }
    }, (error) => {
      console.error(' error:', error);
      alert(' failed To Add the Store .');
    })
  }
  cancel(): void {
    // Implement cancel logic here
    this.dialogRef.close();

  }
}

