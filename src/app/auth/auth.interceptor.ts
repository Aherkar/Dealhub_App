import { HttpInterceptor, HttpRequest, HttpHandler, HttpUserEvent, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import {catchError,map, tap} from "rxjs/operators";



@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.headers.get('No-Auth') == "True")
            return next.handle(req.clone());

        if (localStorage.getItem('userToken') != null) {
            const clonedreq = req.clone({
                headers: req.headers.set("Authorization", "Bearer " + localStorage.getItem('Token'))
            });
            return next.handle(clonedreq).pipe(
                tap(
                  error => {
                    // if (error.status === 401)
                        this.router.navigateByUrl('/login');
                }
                )
              );
        }
        else {
            this.router.navigateByUrl('/login');
        }
    }
}