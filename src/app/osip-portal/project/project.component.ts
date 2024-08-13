
import { Component, OnInit, Inject } from '@angular/core';
import { OsipService } from 'src/app/osip.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  empData: any;
  
  

  constructor(private service: OsipService, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.getAllProject();

  }

  getAllProject() {
    let url = 'project/findAllProject';
    this.service.getFromServer(url).subscribe((resp: any) => {
      if (resp) {
        this.empData = resp;
        // this.filteredData = resp;
      }
    })
  }


  addOrUpdateProject(type: string, data: any) {

    const projectDialogRef = this.dialog.open(ProjectDialogComponent, {
      data: {
        type,
        data
      }
    });


    projectDialogRef.afterClosed().subscribe(result => {
      
      this.getAllProject()
    });

  }
  deleteProject(projectId: string) {
    let url = `project/delete/${projectId}`;
    this.service.deleteFromServer(url).subscribe(
      response => {
        alert('Project deleted successfully!');
        this.getAllProject();
      },
      error => {
        console.error('Error deleting project:', error);
        alert('Failed to delete project.');
      }
    );
  }

  printProject(project: any): void {
    const printContent = `
      <div>
        <h1>Project Details</h1>
        <p><strong>Project Name:</strong> ${project.projectName}</p>
        <p><strong>Start Date:</strong> ${project.startDate}</p>
        <p><strong>Location:</strong> ${project.location}</p>
        <p><strong>Status:</strong> ${project.projectStatus}</p>
        <p><strong>Manager:</strong> ${project.projectManager}</p>
        <p><strong>Staff:</strong> ${project.projectStaff}</p>
        <p><strong>Contractor:</strong> ${project.contracter}</p>
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
    const data = document.getElementById('project-table');
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

        doc.save('project-data.pdf');
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
  selector: 'update-project',
  templateUrl: './project.add.update.html',
  styleUrls: ['./project.add.update.css']
})

// export class ProjectDialogComponent implements OnInit {
export class ProjectDialogComponent implements OnInit {

  projectId: string = '';
  projectName: string = '';
  startDate: string = '';
  location: string = '';
  projectStatus: string = '';
  projectManager: string = '';
  projectStaff: string = '';
  contracter: string = '';
  isSignIn: boolean = true;

  projectData: any;
  empData: any;

  constructor(private service: OsipService, private router: Router, public dialog: MatDialog, public dialogRef: MatDialogRef<ProjectDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data)
    this.projectData = data;
  }

  ngOnInit(): void {
   // this.getProjectDetails();
    if (this.projectData.type == 'update') {
      this.projectId = this.projectData.data.projectId;
      this.projectName = this.projectData.data.projectName;
      this.startDate = this.projectData.data.startDate;
      this.location = this.projectData.data.location;
      this.projectStatus = this.projectData.data.projectStatus;
      this.projectManager = this.projectData.data.projectManager;
      this.projectStaff = this.projectData.data.projectStaff;
      this.contracter = this.projectData.data.contracter;
    }
  }
  

  updateProjectData(): void {
    let url = 'project/update'
    const req = {
      projectId: this.projectId,
      projectName: this.projectName,
      startDate: this.startDate,
      location: this.location,
      projectStatus: this.projectStatus,
      projectManager: this.projectManager,
      projectStaff: this.projectStaff,
      contracter: this.contracter
    }
    this.service.updateToServer(url, req).subscribe((resp: any) => {
      if (resp) {
        console.log(resp)
        alert('Project Updated successfully!');
        this.dialogRef.close();
        // this.router.navigate(['/osip-portal/users']);
      }
    })
  }




  addProjectData(): void {
    let url = 'project/addProject'
    const req = {
      // projectId: this.projectId,
      projectName: this.projectName,
      startDate: this.startDate,
      location: this.location,
      projectStatus: this.projectStatus,
      projectManager: this.projectManager,
      projectStaff: this.projectStaff,
      contracter: this.contracter
    }
    this.service.postToServer(url, req).subscribe((resp: any) => {
      if (resp) {
        console.log(resp)
        alert('New Project Added successfully!');
        this.dialogRef.close();
        // this.router.navigate(['/osip-portal/users']);
      }
    }, (error) => {
      console.error(' error:', error);
      alert(' failed To Add the Project. ProjectName is already taken!".');
    })
  }


  cancel(): void {
    // Implement cancel logic here
    this.dialogRef.close();
  }

}



