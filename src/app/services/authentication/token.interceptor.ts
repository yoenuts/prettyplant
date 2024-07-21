import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(req.url.includes('/login')) {
      const {headers} = req;
      //if logging in, proceed to not adding the token
      return next.handle(req);
    }
    
    //for all other requests, add an authorization header
    const token = this.tokenService.getToken();
    
    //create a clone request
    const newCloneRequest = req.clone( {
      setHeaders:{
        Authorization: `${token}`
      }
    })
    
    return next.handle(newCloneRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === 401) {
          //this.tokenService.flushToken();
          //this.router.navigate(['/login']);

        }
      
        return throwError(error);
     })
    );
  }

}