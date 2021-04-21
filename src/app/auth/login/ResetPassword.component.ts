import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { loginservices } from './LoginServices';
import {ActivatedRoute, Router} from "@angular/router"
import { HttpErrorResponse } from '@angular/common/http';

//region model
export class LoginModel
{
  _user_code:string;
  _password:string;
  _token:string;
}
//endregion

@Component({
    selector: 'app-ResetPassword',
    templateUrl: './ResetPassword.component.html',
    styleUrls: ['./login.component.scss']
  })
  export class ResetPassword implements OnInit
  {
    loginmodel:LoginModel=new LoginModel();
    Usercode:string;
    NewPassword:string;
    confirmpassword:string;
    constructor(private route:ActivatedRoute, private formbuilder:FormBuilder, 
        private _loginservice:loginservices,private router: Router) { }
    
    
      ngOnInit(): void {

      }
      ResetPassword()
      {
        this.route.queryParams.subscribe(event=>{
          this.Usercode=event['Usercode'];
        })
        this.loginmodel._user_code=this.Usercode;
        this.loginmodel._password=this.NewPassword;
         
        this._loginservice.ResetPassword(this.loginmodel).subscribe(Result=>{
          alert("Password Changed Successfully.");
         
        });
      }
  }