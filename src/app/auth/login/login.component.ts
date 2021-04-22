import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { loginservices } from './LoginServices';
import {Router} from "@angular/router"
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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginDetail:any;
  message:string;
  loginmodel:LoginModel=new LoginModel();
  Usercode:any;
  Password:any;
  RememberMe:any;
  ResetPass:boolean=false;
  NewPassword:any="";
  confirmpassword:any="";
  constructor(private formbuilder:FormBuilder, 
    private _loginservice:loginservices,private router: Router) { }


  ngOnInit(): void {
    if(this.ResetPass != true)
    {
      if(localStorage.getItem("rememberCurrentUser")!= null)
      {
        if(localStorage.getItem("rememberCurrentUser")=='true')
        {
          this.loginmodel._user_code = localStorage.getItem('UserName'); 
          this.RememberMe = localStorage.getItem('rememberCurrentUser');
          this.loginmodel._token=localStorage.getItem('Token');
          this.loginmodel._password="abc";
          this.GetToken( this.loginmodel);
        }
    
     }
    }
    
  }
  GetToken(loginmodel)
  {
    this._loginservice.GetToken(loginmodel).subscribe(Result=>{
      console.log(Result);
      if (Result=="Authorised")
      {
       // this.router.navigate(['/DealHUB/dashboard']);
      }
      
    });
  }
  onFormSubmit()
  {
    
    this.loginmodel._user_code=this.Usercode;
    this.loginmodel._password=this.Password;
    
    this._loginservice.getLoginDetails(this.loginmodel).subscribe(Result=>{
      console.log(Result);
      var loginresult =Result;
      if(loginresult.hasOwnProperty("user")){
      if(this.RememberMe)
      {
        localStorage.setItem("UserName",Result.user.UserName);
        localStorage.setItem("Token",Result.user.Api_Key);
        localStorage.setItem("rememberCurrentUser",this.RememberMe);
       }
      else
      {
        localStorage.setItem("rememberCurrentUser",this.RememberMe);
      }
      localStorage.setItem("Token",Result.user.Api_Key);
      localStorage.setItem("userToken",Result.user.Api_Key);
      console.log(Result.user.UserName);
      alert("Login Sucess");
      this.router.navigate(['/DealHUB/dashboard']);
    }
    else
    {
      alert("Login Failed");
    }
     
    },
    (error:HttpErrorResponse)=>{
      alert(error.message);
      
    }
    );
  }
  ResetPassword()
  {
    this.loginmodel._user_code=this.Usercode;
    this.loginmodel._password=this.NewPassword;
     
    this._loginservice.ResetPassword(this.loginmodel).subscribe(Result=>{
      alert("Password Changed Successfully.");
      this.router.navigate(['/DealHUB/dashboard']);
    });
  }
  LostPass(event)
  {
    event.preventDefault();
    this.ResetPass=true;
  }
  GetEmail()
  {
    this.loginmodel._user_code=this.Usercode;
    this.loginmodel._password=this.Password;
    this._loginservice.sendemail(this.loginmodel).subscribe(Result=>{
      alert("Email Send.");
     
    });
  }
}
