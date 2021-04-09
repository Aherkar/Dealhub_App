import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { loginservices } from './LoginServices';
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
  constructor(private formbuilder:FormBuilder, private _loginservice:loginservices) { }


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
     this.message = Result.message;
    });
  }
}
