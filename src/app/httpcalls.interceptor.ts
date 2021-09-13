import { finalize } from 'rxjs/operators';
import { LoaderService } from './loader.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpcallsInterceptor implements HttpInterceptor {

  constructor(private _loader : LoaderService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this._loader.loading.next(true)
    return next.handle(request).pipe(
      finalize(
        ()=> {
          this._loader.loading.next(false)
        }
      )
    );
  }
}
