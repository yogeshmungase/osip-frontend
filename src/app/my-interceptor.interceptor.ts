import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OsipService } from './osip.service';

@Injectable()
export class MyInterceptorInterceptor implements HttpInterceptor {
  constructor(public service: OsipService) {

  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const storedData = null;
    //this.service.getstoredData();
    
    const modifiedRequest = request.clone({
      setHeaders: {
    
      }
    });

    return next.handle(modifiedRequest).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            
            console.log('Response received:', event);
          }
        },
        (error) => {
          
          console.error('Error occurred:', error);
        }
      )
    );
  }
}
