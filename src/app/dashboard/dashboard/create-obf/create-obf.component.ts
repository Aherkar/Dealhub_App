import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { DashboardService } from '../../dashboard.service';
import {DomSanitizer} from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog'
import { TemplateRef, ViewChild } from '@angular/core';
import { MatTableModule ,MatTableDataSource} from '@angular/material/table';
import {Router} from "@angular/router";

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-create-obf',
  templateUrl: './create-obf.component.html',
  styleUrls: ['./create-obf.component.scss']
})
export class CreateOBFComponent implements OnInit {

  data: [][];
  coversheetpath:string="";
  loipopath:string="";
  supportdocpath:string="";
  Comments:string="";
  progress: number = 0;
  OCFData:any[]=[];
    columns:Array<any>;
    displayedColumns:Array<any>;
    ProjectDetails: MatTableDataSource<any>;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  constructor(private _dashboardservice:DashboardService,private sanitizer:DomSanitizer,
    private dialog:MatDialog,private router: Router) { }

  ngOnInit(): void {
  }

  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
}

  files: File[] = [];
  coversheetfiles: File[] = [];
  loipofiles: File[] = [];
  supportfiles: File[] = [];

	onSelect(event,types) {
		console.log(event);
    if(types == "coversheet")
       {
        this.coversheetfiles.push(...event.addedFiles);
        this.files = this.coversheetfiles;
       }
       else if(types == "loipo")
       {
        this.loipofiles.push(...event.addedFiles);
        this.files = this.loipofiles;
       }
       else
       {
        this.supportfiles.push(...event.addedFiles);
        this.files = this.supportfiles;
       }
		// this.files.push(...event.addedFiles);
     this._dashboardservice.uploadImage(this.files).subscribe(
       event => {
         var path="";
         if(event.type === HttpEventType.UploadProgress)
         {
           console.log('Upload Progress: '+Math.round(event.loaded/event.total * 100) +"%");
           this.progress = Math.round(event.loaded/event.total * 100);
         }
         else if(event.type === HttpEventType.Response)
         {
         console.log(event.body);
         path = JSON.stringify(event.body);
       }
       debugger;
       path=path.split('"').join('');
       path = path.substring(0,path.length -1);
       if(types == "coversheet")
       {
        this.coversheetpath = path;
       }
       else if(types == "loipo")
       {
        this.loipopath = path;
       }
       else
       {

       }
        
       }
     );
	}

	onRemove(event) {
		console.log(event);
		this.files.splice(this.files.indexOf(event), 1);
	}
  onFileChange(evt) {
    const excel = evt.target.files[0]
    // this._dashboardservice.uploadImage(excel).subscribe(
    //   event => {
    //     if(event.type === HttpEventType.UploadProgress)
    //     {
    //       console.log('Upload Progress: '+Math.round(event.loaded/event.total * 100) +"%");
    //     }
    //     else if(event.type === HttpEventType.Response)
    //     {
    //     console.log(event);
    //   }
        
    //   }
    // );
     const target : DataTransfer =  <DataTransfer>(evt.target);
    
     if (target.files.length !== 1) throw new Error('Cannot use multiple files');

     const reader: FileReader = new FileReader();

     reader.onload = (e: any) => {
       const bstr: string = e.target.result;

       const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

       const wsname : string = wb.SheetNames[0];

       const ws: XLSX.WorkSheet = wb.Sheets[wsname];

     // console.log(ws.A1.h);
      console.log(ws);

       this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));

      console.log("MAin DATa: "+this.data);

      let x = this.data.slice(1);
       console.log("Sliced DATA"+x);

     };

     reader.readAsBinaryString(target.files[0]);

  }
  GridBinding()
    {
      const columns = this.OCFData
      .reduce((columns, row) => {
        return [...columns, ...Object.keys(row)]
      }, [])
      .reduce((columns, column) => {
        return columns.includes(column)
          ? columns
          : [...columns, column]
      }, [])
    // Describe the columns for <mat-table>.
    this.columns = columns.map(column => {
      return { 
        columnDef: column,
        header: column.replace("_"," "),
        cell: (element: any) => `${element[column] ? element[column] : ``}`     
      }
    })
    this.displayedColumns = this.columns.map(c => c.columnDef);
    this.ProjectDetails = new MatTableDataSource(this.OCFData);
    this.ProjectDetails.sort = this.sort;
    this.ProjectDetails.paginator = this.paginator;
    }
  Prview()
  {
   
    //this.router.navigate(['/DealHUB/dashboard/preview']);
    const dialogRef = this.dialog.open(this.callAPIDialog, {
      width: '550px',
      height:'550px',
      disableClose: true,
     // data: { campaignId: this.params.id }
  })
    
    //let dialogRef = this.dialog.open(this.callAPIDialog);
  }


}
