import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { DashboardService } from '../../dashboard.service';
import {DomSanitizer} from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OBFServices } from '../../services/obfservices.service';
import {​​​​​​​​ MatTableModule ,MatTableDataSource}​​​​​​​​ from'@angular/material/table';
import {​​​​​​​​ MatDialog }​​​​​​​​ from'@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { TemplateRef } from '@angular/core';

interface Serviceslist {
  value: string;
  viewValue: string;
}

interface Solutionservices {
  disabled?: boolean;
  Solutioncategory: string;
  Serviceslist: Serviceslist[];
}

interface Solutiongroup {
  disabled?: boolean;
  Solutioncategory: string;
  Solutionservices: Solutionservices[];
}

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
  progressInfos: any[] = [];
  loiopdisabled:boolean=false;
  OBFData:any;
columns:Array<any>;
displayedColumns:Array<any>;
ProjectDetails: MatTableDataSource<any>;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;

  pokemonControl = new FormControl();
  Solutionservicesarray:Solutionservices[] =[];
  Solutiongroup: Solutiongroup[] = [
    {
      Solutioncategory: 'Services',
      Solutionservices: [
        {Solutioncategory: 'Services',
        Serviceslist: [{value:"Storage Warehouses",viewValue:"Storage Warehouses"},
                      {value:"FTL Transportation",viewValue:"FTL Transportation"},
                      {value:"Express/PTL Transportation",viewValue:"Express/PTL Transportation"},
                      {value:"First Mile Transportation",viewValue:"First Mile Transportation"},
                      {value:"First Mile Transportation",viewValue:"First Mile Transportation"},
                      {value:"Other",viewValue:"Other"},
                      ]
        }
       ]
    },
    {
      Solutioncategory: 'Solutions',
      Solutionservices: [
        {Solutioncategory: 'Services',
        Serviceslist: [{value:"Storage Warehouses",viewValue:"Storage Warehouses"},
                      {value:"FTL Transportation",viewValue:"FTL Transportation"},
                      {value:"Express/PTL Transportation",viewValue:"Express/PTL Transportation"},
                      {value:"First Mile Transportation",viewValue:"First Mile Transportation"},
                      {value:"First Mile Transportation",viewValue:"First Mile Transportation"},
                      {value:"Other",viewValue:"Other"}
                      ]
        },
        {
          Solutioncategory:'Solutions',
          Serviceslist: [{value:"Sort Center Management",viewValue:"Sort Center Management"},
          {value:"Pop-up Sort Centers",viewValue:"Pop-up Sort Centers"},
          {value:"Fulfilment Center Management",viewValue:"Fulfilment Center Management"},
          {value:"Warehousing Solutions",viewValue:"Warehousing Solutions"},
          {value:"Other",viewValue:"Other"}
          ]
        }
       ]
    },
    {
      Solutioncategory: 'Integrated Solutions',
      Solutionservices: [
        {Solutioncategory: 'Services',
        Serviceslist: [{value:"Storage Warehouses",viewValue:"Storage Warehouses"},
                      {value:"FTL Transportation",viewValue:"FTL Transportation"},
                      {value:"Express/PTL Transportation",viewValue:"Express/PTL Transportation"},
                      {value:"First Mile Transportation",viewValue:"First Mile Transportation"},
                      {value:"First Mile Transportation",viewValue:"First Mile Transportation"},
                      {value:"Other",viewValue:"Other"}
                      ]
        },
        {
          Solutioncategory:'Solutions',
          Serviceslist: [{value:"Sort Center Management",viewValue:"Sort Center Management"},
          {value:"Pop-up Sort Centers",viewValue:"Pop-up Sort Centers"},
          {value:"Fulfilment Center Management",viewValue:"Fulfilment Center Management"},
          {value:"Warehousing Solutions",viewValue:"Warehousing Solutions"},
          {value:"Other",viewValue:"Other"}
          ]
        },
        {
          Solutioncategory:'Integrated Solutions',
          Serviceslist: [{value:"Logistics Outsourcing",viewValue:"Logistics Outsourcing"},
          {value:"Cross Border Logistics",viewValue:"Cross Border Logistics"},
          {value:"Multi-Modal Logistics",viewValue:"Multi-Modal Logistics"},
          {value:"Warehousing and Distribution",viewValue:"Warehousing and Distribution"},
          {value:"Other",viewValue:"Other"}
          ]
        }
       ]
    }
  ];


  constructor(private _dashboardservice:DashboardService,private sanitizer:DomSanitizer,public _obfservices:OBFServices,private dialog:MatDialog) { }

  step = 0;
  ngOnInit(): void {
    this._obfservices.ObfCreateForm.reset();
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }


  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
}

  files: File[] = [];
  coversheetfiles: File[] = [];
  loipofiles: File[] = [];
  supportfiles: File[] = [];
  message: string[] = [];

	onSelect(event,types) {
    
    if(types == "coversheet")
       {
        
        if(this.coversheetfiles.length > 1)
        {
          alert("Kindly upload only one Coversheet file");
          return false;
        }
        else{
          this.coversheetfiles.push(...event.addedFiles);
        }
        // this.files = this.coversheetfiles;
        this.updatedatafromcoversheet(event);
        
       }
       else if(types == "loipo")
       {
         if(this.loipofiles.length > 1 )
         {
          alert("Kindly upload only one Loi / Po file");
          return false;
         }
         else{
        this.loipofiles.push(...event.addedFiles);
        }
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
    this.progressInfos = [];
    this.message= [];
    var path="";
    var consolidatedpath="";
    const val = this.validateform();
    if(val)
    {
    for (let i = 0; i < files.length; i++) {
      this.progressInfos[i] = { value: 0, fileName: files[i].name };

    this._dashboardservice.uploadImage(files[i]).subscribe(
      event => {
        
        if(event.type === HttpEventType.UploadProgress)
        {
          console.log('Upload Progress: '+Math.round(event.loaded/event.total * 100) +"%");
          this.progress = Math.round(event.loaded/event.total * 100);
          this.progressInfos[i].value = Math.round(event.loaded/event.total * 100);
        }
        else if(event.type === HttpEventType.Response)
        {
        console.log(event.body);
        path = JSON.stringify(event.body);
      }
      debugger;
      path=path.split('"').join('');
      path = path.substring(0,path.length -1); 
      consolidatedpath += path +",";
      consolidatedpath = consolidatedpath.substring(0,consolidatedpath.length -1);
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
      else if(types == "support")
      {
        this.supportdocpath = path;
        this._obfservices.ObfCreateForm.patchValue({Supportpath: path});
      }
      },
      (err:any)=>{
        this.progressInfos[i].value = 0;
        const msg = 'Could not upload the file: ' + files[i].name;
        this.message.push(msg);
      }
    );
    }
  }
    // this.validateform();
  }

	onRemove(files:File[],event) {
		console.log(event);
		files.splice(files.indexOf(event), 1);
    if(this.coversheetfiles.length == 0)
    {
      this._obfservices.ObfCreateForm.patchValue({coversheet: ""});
    }
    if(this.loipofiles.length == 0)
    {
      this._obfservices.ObfCreateForm.patchValue({Loiposheet: ""});
    }
    if(this.supportfiles.length == 0)
    {
      this._obfservices.ObfCreateForm.patchValue({Supportpath: ""});
    }

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
      console.log(ws);
    // console.log(ws.A1.h);
    this._obfservices.ObfCreateForm.patchValue({Projectname: ws.E4.h});
    this._obfservices.ObfCreateForm.patchValue({Customername: ws.E5.h});
    // this._obfservices.ObfCreateForm.patchValue({Solutioncategory: ws.E6.h});
    // this._obfservices.ObfCreateForm.patchValue({Otherservicesandcategories: ws.E7.h});
    // this._obfservices.ObfCreateForm.patchValue({Projecttype: ws.E5.h});
    this._obfservices.ObfCreateForm.patchValue({Opportunityid: ws.E6.h});
    this._obfservices.ObfCreateForm.patchValue({State: ws.E7.h});
    this._obfservices.ObfCreateForm.patchValue({Vertical: ws.E8.h});
     this._obfservices.ObfCreateForm.patchValue({Verticalhead: ws.E9.w});
    //this._obfservices.ObfCreateForm.patchValue({Verticalhead: "abc"});
    // this._obfservices.ObfCreateForm.patchValue({Sector: ws.E11.h});
    // this._obfservices.ObfCreateForm.patchValue({Subsector: ws.E12.h});
    this._obfservices.ObfCreateForm.patchValue({Projectbrief: ws.D12.h});
    this._obfservices.ObfCreateForm.patchValue({Totalrevenue: ws.D13.w});
    this._obfservices.ObfCreateForm.patchValue({Totalcost: ws.F13.w});
    this._obfservices.ObfCreateForm.patchValue({Totalmargin: ws.H13.w});
    this._obfservices.ObfCreateForm.patchValue({Totalprojectlife: ws.D14.w});
    this._obfservices.ObfCreateForm.patchValue({IRRsurpluscash: ws.F14.w});
    this._obfservices.ObfCreateForm.patchValue({EBT: ws.H14.w});
    this._obfservices.ObfCreateForm.patchValue({Capex: ws.D15.w});
    this._obfservices.ObfCreateForm.patchValue({IRRborrowedfund: ws.F15.w});
    this._obfservices.ObfCreateForm.patchValue({Paymentterms: ws.H15.w});
    this._obfservices.ObfCreateForm.patchValue({Assumptionrisks: ws.D17.h});
    this._obfservices.ObfCreateForm.patchValue({Loipo: ws.D18.h});
    console.log("check form values");
    console.log(this._obfservices.ObfCreateForm);
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
    const val =  this.validateform();
    if(val)
    {
     console.log(this._obfservices.ObfCreateForm.value);
    }
       }

  onCheckboxChange(e) {
    if(e.currentTarget.checked)
    {
      this._obfservices.ObfCreateForm.get('Loiposheet').clearValidators();
      this._obfservices.ObfCreateForm.get('Loiposheet').updateValueAndValidity();
      this._obfservices.ObfCreateForm.patchValue({Loiposheet: ""});
      this.loipofiles.length=0;
      this.loiopdisabled = true;
    }
    else{
      this._obfservices.ObfCreateForm.get('Loiposheet').setValidators(Validators.required)
      this._obfservices.ObfCreateForm.get('Loiposheet').updateValueAndValidity();
      this.loiopdisabled = false;
    }
  }

  // GridBinding()
  //   {
  //     debugger;
  //     const columns = this.OBFData
  //     .reduce((columns, row) => {
  //       return [...columns, ...Object.keys(row)]
  //     }, [])
  //     .reduce((columns, column) => {
  //       return columns.includes(column)
  //         ? columns
  //         : [...columns, column]
  //     }, [])
  //   // Describe the columns for <mat-table>.
  //   this.columns = columns.map(column => {
  //     return { 
  //       columnDef: column,
  //       header: column.replace("_"," "),
  //       cell: (element: any) => `${element[column] ? element[column] : ``}`     
  //     }
  //   })
  //   this.displayedColumns = this.columns.map(c => c.columnDef);
  //   this.ProjectDetails = new MatTableDataSource(this.OBFData);
  //   this.ProjectDetails.sort = this.sort;
  //   this.ProjectDetails.paginator = this.paginator;
  //   }
  Prview()
  {
    debugger;
    this.OBFData = this._obfservices.ObfCreateForm.getRawValue();
    // this.GridBinding();
    //this.router.navigate(['/DealHUB/dashboard/preview']);
    const dialogRef = this.dialog.open(this.callAPIDialog, {
      width: '80%',
      height:'80%',
      disableClose: true,
     // data: { campaignId: this.params.id }
  })
    
    //let dialogRef = this.dialog.open(this.callAPIDialog);
  }

  EditOBF()
  {
    this._obfservices.ObfCreateForm.setValue(this._obfservices.ObfCreateForm.value);
    this.dialog.closeAll();
  }
   
  validateform()
  {
    if(this._obfservices.ObfCreateForm.get('Projectname').errors)
    {
      alert("Project name is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Customername').errors)
    {
      alert("Customer name is required");
      return false;
    }
    // else if(this._obfservices.ObfCreateForm.get('Solutioncategory').errors)
    // {
    //   alert("Solution category is required");
    //   return false;
    // }
    // else if(this._obfservices.ObfCreateForm.get('Otherservicesandcategories').errors)
    // {
    //   alert("Other Services and Solutions field is required");
    //   return false;
    // }
    else if(this._obfservices.ObfCreateForm.get('Opportunityid').errors)
    {
      alert("Opportunityid is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('State').errors)
    {
      alert("Project primay location is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Vertical').errors)
    {
      alert("Vertical field is required");
      return false;
    }
    // else if(this._obfservices.ObfCreateForm.get('Sector').errors)
    // {
    //   alert("Sector field is required");
    //   return false;
    // }
    else if(this._obfservices.ObfCreateForm.get('Verticalhead').errors)
    {
      alert("Vertical head field is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Projectbrief').errors)
    {
      alert("Project brief is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Totalrevenue').errors)
    {
      alert("Total revenue field is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Totalcost').errors)
    {
      alert("Total cost field is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Totalmargin').errors)
    {
      alert("Total margin field is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Totalprojectlife').errors)
    {
      alert("Total project life field is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Capex').errors)
    {
      alert("Capex field is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Paymentterms').errors)
    {
      alert("Payment terms field is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Assumptionrisks').errors)
    {
      alert("Assumption and risks  field is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Loipo').errors)
    {
      alert("Loi / po  field is required");
      return false;
    }
    return true;
  }

  onchange(evt)
  {
    alert("hello world");
    console.log(evt);
    var result = this.Solutiongroup.filter(obj => {
      return obj.Solutioncategory === evt.value;
    });
    this.Solutionservicesarray = result[0].Solutionservices;
   
    
  }

}
