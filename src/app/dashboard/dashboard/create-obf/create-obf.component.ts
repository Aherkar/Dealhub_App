import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { DashboardService } from '../../dashboard.service';
import {DomSanitizer} from '@angular/platform-browser';

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
  constructor(private _dashboardservice:DashboardService,private sanitizer:DomSanitizer) { }

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

}
