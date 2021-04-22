import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { DashboardService } from '../../dashboard.service';
import {DomSanitizer} from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
  ObfCreateForm:FormGroup;
  constructor(private _dashboardservice:DashboardService,private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    this.ObfCreateForm = new FormGroup({
     coversheet : new FormControl("",Validators.required),
     Loiposheet : new FormControl("",Validators.required),
     Loipodropdown: new FormControl("PO"),
     Selfdeclare: new FormControl(""),
     Projectname:new FormControl(""),
     Projecttype:new FormControl(""),
     Opportunityid:new FormControl(""),
     State:new FormControl(""),
     Vertical:new FormControl(""),
     Verticalhead:new FormControl(""),
     Createddate:new FormControl(""),
     Sapio:new FormControl(""),
     Customername:new FormControl(""),
     Sapcustomercode:new FormControl(""),
     Projectprimarylocation:new FormControl(""),
     Solutiontype:new FormControl(""),
     Sector:new FormControl(""),
     Subsector:new FormControl(""),
     Totalrevenue:new FormControl(""),
     Totalcost:new FormControl(""),
     Totalmargin:new FormControl(""),
     Totalprojectlife:new FormControl(""),
     EBT:new FormControl(""),
     Capex:new FormControl(""),
     IRRsurpluscash:new FormControl(""),
     IRRborrowedfund:new FormControl(""),
     Paymentterms:new FormControl(""),
     Projectdate:new FormControl(""),
     Projectbrief:new FormControl(""),
     Assumptionrisks:new FormControl(""),
     Loipo:new FormControl(""),
     comments:new FormControl("")
    });
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
       this.ObfCreateForm.patchValue({coversheet: path});
      }
      else if(types == "loipo")
      {
       this.loipopath = path;
       this.ObfCreateForm.patchValue({Loiposheet: path});
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
    this.ObfCreateForm.patchValue({Projectname: ws.E4.h});
    this.ObfCreateForm.patchValue({Projecttype: ws.E5.h});
    this.ObfCreateForm.patchValue({Opportunityid: ws.E6.h});
    this.ObfCreateForm.patchValue({State: ws.E7.h});
    this.ObfCreateForm.patchValue({Vertical: ws.E8.h});
    this.ObfCreateForm.patchValue({Verticalhead: ws.E9.h});
    this.ObfCreateForm.patchValue({Projectbrief: ws.D12.v});
    this.ObfCreateForm.patchValue({Totalrevenue: ws.D13.w});
    this.ObfCreateForm.patchValue({Totalcost: ws.F13.w});
    this.ObfCreateForm.patchValue({Totalmargin: ws.H13.w});
    this.ObfCreateForm.patchValue({Totalprojectlife: ws.D14.w});
    this.ObfCreateForm.patchValue({IRRsurpluscash: ws.F14.w});
    this.ObfCreateForm.patchValue({EBT: ws.H14.w});
    this.ObfCreateForm.patchValue({Capex: ws.D15.w});
    this.ObfCreateForm.patchValue({IRRborrowedfund: ws.F15.w});
    this.ObfCreateForm.patchValue({Paymentterms: ws.D16.w});
    this.ObfCreateForm.patchValue({Assumptionrisks: ws.D17.w});
    this.ObfCreateForm.patchValue({Loipo: ws.D18.w});
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
     console.log(this.ObfCreateForm.value);
       }

  onCheckboxChange(e) {
    if(e.currentTarget.checked)
    {
      this.ObfCreateForm.get('Loiposheet').clearValidators();
      this.ObfCreateForm.get('Loiposheet').updateValueAndValidity();
    }
    else{
      this.ObfCreateForm.get('Loiposheet').setValidators(Validators.required)
      this.ObfCreateForm.get('Loiposheet').updateValueAndValidity();
    }
  }

}
