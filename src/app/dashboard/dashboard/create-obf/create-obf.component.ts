import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { DashboardService } from '../../dashboard.service';
import {DomSanitizer} from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OBFServices } from '../../services/obfservices.service';

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
  constructor(private _dashboardservice:DashboardService,private sanitizer:DomSanitizer,public _obfservices:OBFServices) { }

  ngOnInit(): void {
    this._obfservices.ObfCreateForm.reset();
  }


  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
}

  files: File[] = [];
  coversheetfiles: File[] = [];
  loipofiles: File[] = [];
  supportfiles: File[] = [];

	onSelect(event,types) {
    debugger;
		console.log(event);
    if(types == "coversheet")
       {
        this.coversheetfiles.push(...event.addedFiles);
        // this.files = this.coversheetfiles;
        this.updatedatafromcoversheet(event);
        
       }
       else if(types == "loipo")
       {
        this.loipofiles.push(...event.addedFiles);
        // this.files = this.loipofiles;
       }
       else
       {
        this.supportfiles.push(...event.addedFiles);
        // this.files = this.supportfiles;
       }
		// this.files.push(...event.addedFiles);
     
	}

  uploadfiles(files:File[],types)
  {
    this._dashboardservice.uploadImage(files).subscribe(
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
       this._obfservices.ObfCreateForm.patchValue({coversheet: path});
      }
      else if(types == "loipo")
      {
       this.loipopath = path;
       this._obfservices.ObfCreateForm.patchValue({Loiposheet: path});
      }
      else
      {

      }
       
      }
    );

  }

	onRemove(files:File[],event) {
		console.log(event);
		this.files.splice(files.indexOf(event), 1);
	}
  updatedatafromcoversheet(evt)
  {
    console.log(evt);
   // const target : DataTransfer =  <DataTransfer>(evt.target);
    
    if (evt.addedFiles.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;

      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      debugger;

      const wsname : string = wb.SheetNames[6];

      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

    // console.log(ws.A1.h);
    this._obfservices.ObfCreateForm.patchValue({Projectname: ws.E4.h});
    this._obfservices.ObfCreateForm.patchValue({Projecttype: ws.E5.h});
    this._obfservices.ObfCreateForm.patchValue({Opportunityid: ws.E6.h});
    this._obfservices.ObfCreateForm.patchValue({State: ws.E7.h});
    this._obfservices.ObfCreateForm.patchValue({Vertical: ws.E8.h});
    this._obfservices.ObfCreateForm.patchValue({Verticalhead: ws.E9.h});
    this._obfservices.ObfCreateForm.patchValue({Projectbrief: ws.D12.v});
    this._obfservices.ObfCreateForm.patchValue({Totalrevenue: ws.D13.w});
    this._obfservices.ObfCreateForm.patchValue({Totalcost: ws.F13.w});
    this._obfservices.ObfCreateForm.patchValue({Totalmargin: ws.H13.w});
    this._obfservices.ObfCreateForm.patchValue({Totalprojectlife: ws.D14.w});
    this._obfservices.ObfCreateForm.patchValue({IRRsurpluscash: ws.F14.w});
    this._obfservices.ObfCreateForm.patchValue({EBT: ws.H14.w});
    this._obfservices.ObfCreateForm.patchValue({Capex: ws.D15.w});
    this._obfservices.ObfCreateForm.patchValue({IRRborrowedfund: ws.F15.w});
    this._obfservices.ObfCreateForm.patchValue({Paymentterms: ws.D16.w});
    this._obfservices.ObfCreateForm.patchValue({Assumptionrisks: ws.D17.w});
    this._obfservices.ObfCreateForm.patchValue({Loipo: ws.D18.w});
     console.log(ws);

      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));

     console.log("MAin DATa: "+this.data);

     let x = this.data.slice(1);
      console.log("Sliced DATA"+x);

    };

    reader.readAsBinaryString(evt.addedFiles[0]);



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
       }

  Saveasdraft(){
     console.log(this._obfservices.ObfCreateForm.value);
       }

  onCheckboxChange(e) {
    if(e.currentTarget.checked)
    {
      this._obfservices.ObfCreateForm.get('Loiposheet').clearValidators();
      this._obfservices.ObfCreateForm.get('Loiposheet').updateValueAndValidity();
    }
    else{
      this._obfservices.ObfCreateForm.get('Loiposheet').setValidators(Validators.required)
      this._obfservices.ObfCreateForm.get('Loiposheet').updateValueAndValidity();
    }
  }

}
