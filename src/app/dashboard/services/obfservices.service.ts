import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class OBFServices {

  constructor() { }

  ObfCreateForm = new FormGroup({
    coversheet : new FormControl("",Validators.required),
    Loiposheet : new FormControl("",Validators.required),
    Supportpath : new FormControl(""),
    Loipodropdown: new FormControl("PO"),
    Selfdeclare: new FormControl(""),
    Projectname:new FormControl("",Validators.required),
    Projecttype:new FormControl(""),
    Solutioncategory:new FormControl("",Validators.required),
    Otherservicesandcategories:new FormControl("",Validators.required),
    Opportunityid:new FormControl("",Validators.required),
    State:new FormControl("",Validators.required),
    Vertical:new FormControl("",Validators.required),
    Verticalhead:new FormControl("",Validators.required),
    Createddate:new FormControl(""),
    Sapio:new FormControl(""),
    Customername:new FormControl("",Validators.required),
    Sapcustomercode:new FormControl(""),
    Projectprimarylocation:new FormControl(""),
    Solutiontype:new FormControl(""),
    Sector:new FormControl("",Validators.required),
    Subsector:new FormControl(""),
    Totalrevenue:new FormControl("",Validators.required),
    Totalcost:new FormControl("",Validators.required),
    Totalmargin:new FormControl("",Validators.required),
    Totalprojectlife:new FormControl("",Validators.required),
    EBT:new FormControl(""),
    Capex:new FormControl("",Validators.required),
    IRRsurpluscash:new FormControl(""),
    IRRborrowedfund:new FormControl(""),
    Paymentterms:new FormControl("",Validators.required),
    Projectdate:new FormControl(""),
    Projectbrief:new FormControl("",Validators.required),
    Assumptionrisks:new FormControl("",Validators.required),
    Loipo:new FormControl("",Validators.required),
    comments:new FormControl("")
   });
}
