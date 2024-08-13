

import { Component, OnInit, Inject } from '@angular/core';
import { OsipService } from 'src/app/osip.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent implements OnInit {
  empData: any;
  constructor(private service: OsipService, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.getAllWarehouse();

  }

  getAllWarehouse() {
    let url = 'warehouse/findAllWarehouses';
    this.service.getFromServer(url).subscribe((resp: any) => {
      if (resp) {
        this.empData = resp;
      }
    })
  }

  addorUpdateWarehouse(type: string, data: any) {

    const warehouseDialogRef = this.dialog.open(WarehouseDialogComponent, {
      data: {
        type,
        data
      }
    });

    warehouseDialogRef.afterClosed().subscribe(result => {
      
      this.getAllWarehouse()
    });

  }
  deleteWarehouse(warehouseId: string) {
    // let url = `warehouse/delete/${warehouseId}`;
    const url = `warehouse/delete/${warehouseId}`;
    this.service.deleteFromServer(url ,{} ).subscribe(
      response => {
        alert('Warehouse deleted successfully!');
        this.getAllWarehouse();
      },
      error => {
        console.error('Error deleting warehouse:', error);
        alert('Failed to delete warehouse.');
      }
    );
  }

  printWarehouse(warehouse: any): void {
    const printContent = `
      <div>
        <h1>Warehouse Details</h1>
        <p><strong>Location:</strong> ${warehouse.location}</p>
        <p><strong>Manager Name:</strong> ${warehouse.managerName}</p>
        <p><strong>Manager Phone No:</strong> ${warehouse.managerPhoneNo}</p>
        <p><strong>Capacity:</strong> ${warehouse.capacity}</p>
        <p><strong>Status:</strong> ${warehouse.status}</p>
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
    const data = document.getElementById('warehouse-table');
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

        doc.save('warehouse-data.pdf');
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
  selector: 'warehouse.add.update',
  templateUrl: './warehouse.add.update.html',
  styleUrls: ['./warehouse.add.update.css']
})

export class WarehouseDialogComponent implements OnInit {
  warehouseId: string = '';
  location: string = '';
  managerId: string = '';
  warehouseManagerName: string = '';
  warehouseManagerPhone: string = '';
  email: string = '';
  isSignIn: boolean = true;
  warehouseData:any;
  empData: any;

  constructor(private service: OsipService, public dialog: MatDialog, public dialogRef: MatDialogRef<WarehouseDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  this.warehouseData = data;
  
  }

  ngOnInit(): void {
    if (this.warehouseData.type == 'update') {
      this.warehouseId = this.warehouseData.data.warehouseId;
      this.location = this.warehouseData.data.location;
      this.managerId= this.warehouseData.data.managerId;
      this.warehouseManagerName = this.warehouseData.data.warehouseManagerName;
      this.warehouseManagerPhone = this.warehouseData.data.warehouseManagerPhone;
      this.email = this.warehouseData.data.email;
    }

  }
  updateWarehouseData(): void {
    let url = 'warehouse/update';
    const req = {
      warehouseId: this.warehouseId,
      location: this.location,
      managerId:this.managerId,
      warehouseManagerName: this.warehouseManagerName,
      warehouseManagerPhone: this.warehouseManagerPhone,
      email: this.email
    };
    this.service.updateToServer(url, req).subscribe((resp: any) => {
      if (resp) {
        console.log(resp);
        alert('Warehouse Updated successfully!');
        this.dialogRef.close();
      }
    });
  }
  
addWarehouseData(): void {
  let url = 'warehouse/addWarehouse';
  const req = {
    warehouseId: this.warehouseId,
    location: this.location,
    managerId:this.managerId,
    warehouseManagerName: this.warehouseManagerName,
    warehouseManagerPhone: this.warehouseManagerPhone,
    email: this.email
  };
  this.service.postToServer(url, req).subscribe((resp: any) => {
    if (resp) {
      console.log(resp);
      alert('New Warehouse Added successfully!');
      this.dialogRef.close();
    }
  }, (error) => {
    console.error(' error:', error);
    alert('Failed to Add the Warehouse.');
  });
}
cancel(): void {
  // Implement cancel logic here
  this.dialogRef.close();
}

}








