import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { loginservices } from './LoginServices';
import {Router} from "@angular/router"
import { HttpErrorResponse } from '@angular/common/http';
//region model
export class LoginModel
{
  _user_code:string;
  _password:string;
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
  constructor(private formbuilder:FormBuilder, private _loginservice:loginservices,private router: Router) { }


  ngOnInit(): void {
    this.loginDetail= this.formbuilder.group({
      usercode:['',[Validators.required]],
      password:['',[Validators.required]]

    })
    
  }
  onFormSubmit()
  {
    
    this.loginmodel._user_code=this.Usercode;
    this.loginmodel._password=this.Password;
    this._loginservice.getLoginDetails(this.loginmodel).subscribe(Result=>{
      console.log(Result);
      var loginresult =Result;

      if(loginresult.hasOwnProperty("user")){
        localStorage.setItem("Token",Result.user.Api_Key);
        localStorage.setItem("Token",Result.user.Api_Key);
        localStorage.setItem("UserName",Result.user.UserName);
        alert("Login Sucess");
        console.log(Result.user.UserName);
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
}
