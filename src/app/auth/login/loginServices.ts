import {Injectable} from '@angular/core'
import {HttpClient}from '@angular/common/http'
import {HttpHeaders} from '@angular/common/http'
import {Observable, observable} from 'rxjs'
import{LoginModel} from './login.component'
@Injectable({
    providedIn:'root'
})
export class loginservices
{
    url='http://localhost:52229/Api/Auth/Login';
    constructor(private http:HttpClient){}
    // getLoginDetails(logindetail:LoginModel): Observable<any>{
    //     return this.http.post<any>(this.url,logindetail);
    // }
    getLoginDetails(loginDetail: any): Observable<any> {  
	    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
	    return this.http.post<any>(this.url,  
	    loginDetail, httpOptions);  
	  }
}