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
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent {
  empData: any;
  constructor(private service: OsipService, public dialog: MatDialog, private http: HttpClient) {

}
ngOnInit(): void {
  this.getAllPurchase();

}

getAllPurchase() {
  let url = 'purchase/findAllPurchases';
  this.service.getFromServer(url).subscribe((resp: any) => {
    if (resp) {
      this.empData = resp;
    }
  })
}

addPurchase(type: string, data: any) {

  const purchaseDialogRef = this.dialog.open(PurchaseDialogComponent, {
    data: {
      type,
      data
    }
  });

  purchaseDialogRef.afterClosed().subscribe(result => {
    // this.fetchApplicationData(this.search,this.params.pageIndex, this.params.pageSize);
    this.getAllPurchase()
  });

}
deletePurchase(employeeId: string) {
  const url = `http://localhost:8080/api/employee/delete/${employeeId}`;
  this.http.delete(url).subscribe(
    response => {
      console.log('Purchase deleted successfully', response);
      // Update the empData array to reflect the deletion
      this.empData = this.empData.filter((employee: { id: string; }) => employee.id !== employeeId);
    },
    error => {
      console.error('Error deleting Purchase', error);
    }
  );
}
 
printPurchase(purchase: any): void {
  const printContent = `
    <div>
      <h1>Purchase Details</h1>
      <p><strong>Purchase Id:</strong> ${purchase.id}</p>
      <p><strong>Supplier Name:</strong> ${purchase.supplierName}</p>
      <p><strong>Store Name:</strong> ${purchase.storeName}</p>
      <p><strong>Purchase OrderId:</strong> ${purchase.purchaseOrderId}</p>
      <p><strong>Purchase Date:</strong> ${purchase.purchaseDate}</p>
      <p><strong>Product Name:</strong> ${purchase.productName}</p>
      <p><strong>Product Id:</strong> ${purchase.productId}</p>
      <p><strong>Unit Price:</strong> ${purchase.unitPrice}</p>
      <p><strong>Total Cost:</strong> ${purchase.totalCost}</p>
      <p><strong>Status:</strong> ${purchase.status}</p>
      <p><strong>Payment Status:</strong> ${purchase.paymentStatus}</p>
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
  const data = document.getElementById('purchase-table');
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

      doc.save('purchase-data.pdf');
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
  selector: 'purchase.add.update',
  templateUrl: './purchase.add.update.html',
  styleUrls: ['./purchase.add.update.css']
})
export class PurchaseDialogComponent implements OnInit {
  
  id:string = '';
  supplierName:string = '';
  storeName:string = '';
  purchaseOrderId:string = '';
  purchaseDate:string = '';
  productName:string = '';
  productId:string = '';
  unitPrice:string = '';
  
  totalCost:string = '';
  status:string = '';
  paymentStatus:string = '';
  
  
  isSignIn: boolean = true;

  purchaseData: any;
  empData: any;
 
  constructor(private service: OsipService, public dialog: MatDialog, private router: Router, public dialogRef: MatDialogRef<PurchaseDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  this.purchaseData=data;

  }
  ngOnInit(): void {
    if (this.purchaseData.type == 'update'){
      this.id=this.purchaseData.data.id;
      this.supplierName=this.purchaseData.data.supplierName;
      this.storeName=this.purchaseData.data.storeName;
      this.purchaseOrderId=this.purchaseData.data.purchaseOrderId;
      this.purchaseDate=this.purchaseData.data.purchaseDate;
      this.productName=this.purchaseData.data.productName;
      this.productId=this.purchaseData.data.productId;
      this.unitPrice=this.purchaseData.data.unitPrice;
      this.totalCost=this.purchaseData.data.totalCost;
      this.status=this.purchaseData.data.status;
      this.paymentStatus=this.purchaseData.data.paymentStatus;
      
    }
  }

  updatePurchaseData():void{
    let url ='purchase/update'
    const req ={
      id:this.id,
      supplierName:this.supplierName,
      storeName:this.storeName,
      purchaseOrderId:this.purchaseOrderId,
      purchaseDate:this.purchaseDate,
      productName:this.productName,
      productId:this.productId,
      unitPrice:this.unitPrice,
      totalCost:this.totalCost,
      status:this.status,
      paymentStatus:this.paymentStatus
    }
    this.service.updateToServer(url, req).subscribe((resp: any) => {
      if (resp) {
        console.log(resp)
        alert('Purchase Details Updated successfully!');
        this.dialogRef.close();
       
      }
    }, (error) => {
      console.error(' error:', error);
      alert(' failed To Update the Purchase List .');
    })
  }
  addPurchaseData():void{
    let url ='purchase/addPurchase'
    const req ={
      id:this.id,
      supplierName:this.supplierName,
      storeName:this.storeName,
      purchaseOrderId:this.purchaseOrderId,
      purchaseDate:this.purchaseDate,
      productName:this.productName,
      productId:this.productId,
      unitPrice:this.unitPrice,
      totalCost:this.totalCost,
      status:this.status,
      paymentStatus:this.paymentStatus
    }
    this.service.postToServer(url, req).subscribe((resp: any) => {
      if (resp) {
        console.log(resp)
        alert('New Purchase List Added successfully!');
        this.dialogRef.close();
        // this.router.navigate(['/osip-portal/users']);
      }
    }, (error) => {
      console.error(' error:', error);
      alert(' failed To Add the Purchase List .');
    })
  }
  cancel(): void {
    
    this.dialogRef.close();
  }
}
