import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-create-obf',
  templateUrl: './create-obf.component.html',
  styleUrls: ['./create-obf.component.scss']
})
export class CreateOBFComponent implements OnInit {

  data: [][];
  constructor(private _dashboardservice:DashboardService) { }

  ngOnInit(): void {
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

      console.log(ws.A1.h);

       this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));

      console.log("MAin DATa: "+this.data);

      let x = this.data.slice(1);
       console.log("Sliced DATA"+x);

     };

     reader.readAsBinaryString(target.files[0]);

  }

}
