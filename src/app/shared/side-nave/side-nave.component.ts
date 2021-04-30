import { Component, OnInit } from '@angular/core';
import {SidenavService} from './sidenav.service';
import { HttpErrorResponse } from '@angular/common/http';
import {Router} from "@angular/router"
export class MenuModel
{
  _user_code:any;
  token:any;

}

@Component({
  selector: 'app-side-nave',
  templateUrl: './side-nave.component.html',
  styleUrls: ['./side-nave.component.scss']
})
export class SideNaveComponent implements OnInit {


  constructor(private menuservice:SidenavService,private router: Router) { }
  // signle open mode
  config = { multi: false };
  options = { multi: false };
  menus:any=null;
  _menumodel:MenuModel=new MenuModel();

  ngOnInit(): void {
    this.config = this.mergeConfig(this.options);
    //this.GetMenus();
  }
  
  mergeConfig(options) {
 
    const config = {
      // selector: '#accordion',
      multi: true
    };

    return { ...config, ...options };
  }

  toggle(index: number) {
   
    if (!this.config.multi) {
      this.menus.filter(
        (menu, i) => i !== index && menu.active
      ).forEach(menu => menu.active = !menu.active);
    }


    this.menus[index].active = !this.menus[index].active;
  }

  GetMenus()
  {
    debugger;
    this._menumodel._user_code=localStorage.getItem("UserName");
    this._menumodel.token=localStorage.getItem("Token");
    this.menuservice.GetMenus(this._menumodel).subscribe(Result=>{
      debugger;
      console.log("Menus");
      console.log(Result);
      var loginresult =Result;
      var tempmenu=JSON.parse(Result);
      this.menus=
      [
        {
          name: 'Deal Hub Main Menu',
          iconClass: 'fa fa-code',
          active: true,
          submenu:[]
        }
     ];

     for (var i=0;i<tempmenu.length;i++)
     {
       this.menus[0].submenu.push(tempmenu[i]);
     }



    
     
    },
    (error:HttpErrorResponse)=>{
      debugger;
      if (error.status==401)
      {
        this.router.navigateByUrl('/login');
        
      }
      
    }
    );

  }
  

  


 
}
