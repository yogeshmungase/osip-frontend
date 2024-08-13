
import { Component, OnInit, Inject } from '@angular/core';
import { OsipService } from 'src/app/osip.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  empData: any;
  constructor(private service: OsipService, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.getAllProduct();

  }

  getAllProduct() {
    let url = 'item/findAllItem';
    this.service.getFromServer(url).subscribe((resp: any) => {
      {
        if (resp) {
          // Calculate remainingQuantity for each product
          this.empData = resp.map((product: any) => ({
            ...product,
            remainingQuantity: product.totalQuantity - product.usedQuantity
          }));
        }
      }});
  }

  addOrUpdateProduct(type: string, data: any) {

    const productDialogRef = this.dialog.open(ProductDialogComponent, {
      data: {
        type,
        data
      }
    });

    productDialogRef.afterClosed().subscribe(result => {
      // this.fetchApplicationData(this.search,this.params.pageIndex, this.params.pageSize);
      this.getAllProduct()
    });

  }
  deleteProduct(product: any): void {
    if (confirm(`Are you sure you want to delete user ${product.name}?`)) {
      let url = `item/delete/${product.id}`;
      this.service.deleteFromServer(url).subscribe(
        response => {
          alert('Product deleted successfully!');
          this.getAllProduct();
        },
        error => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product.');
        }
      );
    }
  }
  
  printProduct(product: any): void {
    const printContent = `
      <div>
        <h1>User Details</h1>
        <p><strong>Productname:</strong> ${product.name}</p>
        <p><strong>SKU:</strong> ${product.sku}</p>
        <p><strong>Brand:</strong> ${product.brand}</p>
        <p><strong>Price:</strong> ${product.price}</p>
        <p><strong>Total Quantity:</strong> ${product.totalQuantity}</p>
        <p><strong>Used Quantity:</strong> ${product.usedQuantity}</p>
        <p><strong>Remaining Quantity:</strong> ${product.remainingQuantity}</p>
        <p><strong>Status:</strong> ${product.status}</p>
        <p><strong>Order By Store:</strong> ${product.createdByStore}</p>
        <p><strong>Date of Entry:</strong> ${product.dateOfEntry}</p>
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
    const data = document.getElementById('product-table');
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

        doc.save('product-data.pdf');
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
  selector: 'product.add.update',
  templateUrl: './product.add.update.html',
  styleUrls: ['./product.add.update.css']
})

export class ProductDialogComponent implements OnInit {
  
  id : string = '';
  name : string = '';
  sku : string = '';
  brand : string = '';
  price : string = '';
  totalQuantity : string = '';
  usedQuantity : string = '';
  remainingQuantity : string = '';
  status : string = '';
  createdByStore : string = '';
  dateOfEntry : string = '';
  isSignIn: boolean = true;


  productData:any;
  empData: any;
  constructor(private service: OsipService,private router: Router, public dialog: MatDialog, public dialogRef: MatDialogRef<ProductDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  
  this.productData = data;

  }

  ngOnInit(): void {
    if (this.productData.type == 'update') {
      this.id=this.productData.data.id;
      this.name=this.productData.data.name;
      this.sku=this.productData.data.sku;
      this.brand=this.productData.data.brand;
      this.price=this.productData.data.price;
      this.totalQuantity=this.productData.data.totalQuantity;
      this.usedQuantity=this.productData.data.usedQuantity;
      this.remainingQuantity=this.productData.data.remainingQuantity;
      this.status=this.productData.data.status;
      this.createdByStore=this.productData.data.createdByStore;
      this.dateOfEntry=this.productData.data.dateOfEntry;
    }
  }


  updateProductData():void{
    let url ='item/update'
    const req = {
      id : this.id,
      name : this.name,
      sku : this.sku,
      brand : this.brand,
      price : this.price,
      totalQuantity : this.totalQuantity,
      usedQuantity : this.usedQuantity,
      remainingQuantity : this.remainingQuantity,
      status : this.status,
      createdByStore : this.createdByStore,
      dateOfEntry : this.dateOfEntry
    }
    this.service.updateToServer(url, req).subscribe((resp: any) => {
      if (resp) {
        console.log(resp)
        alert('Product Updated successfully!');
        this.dialogRef.close();
        // this.router.navigate(['/osip-portal/users']);
      }
    })
  }

  addProductData(): void{
    let url = 'item/addItem'
    const req = {
      id : this.id,
      name : this.name,
      sku : this.sku,
      brand : this.brand,
      price : this.price,
      totalQuantity : this.totalQuantity,
      usedQuantity : this.usedQuantity,
      remainingQuantity : this.remainingQuantity,
      status : this.status,
      createdByStore : this.createdByStore,
      dateOfEntry : this.dateOfEntry
    }
    this.service.postToServer(url, req).subscribe((resp: any) => {
      if (resp) {
        console.log(resp)
        alert('New Product Added successfully!');
        this.dialogRef.close();
        // this.router.navigate(['/osip-portal/users']);
      }
    }, (error) => {
      console.error(' error:', error);
      alert(' failed To Add the Product. ');
    })
  }
  cancel(): void {
    // Implement cancel logic here
    this.dialogRef.close();
  }
}

