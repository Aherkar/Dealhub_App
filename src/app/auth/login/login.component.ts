import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { loginservices } from './LoginServices';
import {Router} from "@angular/router"
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
        alert("Login Sucess");
        this.router.navigate(['/DealHUB/dashboard'])
    }
    else
    {
      alert("Login Failed");
    }
     
    });
  }
}
