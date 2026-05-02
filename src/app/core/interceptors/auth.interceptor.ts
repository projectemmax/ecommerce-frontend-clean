import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '@app/core/auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isRedirecting = false;

    constructor(
        private auth: AuthService,
        private router: Router
    ) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        const token = this.auth.getToken();

        // 👇 IMPORTANT: skip login request
        if (token && !req.url.includes('/auth/login')) {
        req = req.clone({
            setHeaders: {
            Authorization: `Bearer ${token}`
            }
        });
        }

        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {

                if (
                    error.status === 401 && 
                    !req.url.includes('/auth/login') &&
                    !this.isRedirecting 
                ) {
                    this.isRedirecting = true;
                    
                    const isAdminRoute = this.router.url.startsWith('/admin');

                    console.warn('Session expired');

                    if (isAdminRoute) {
                        // 🔐 ADMIN → force login
                        this.auth.logout('login');
                    } else {
                        // 🛍️ STOREFRONT → soft logout (no redirect)
                        this.auth.logout('storefront');
                    }
                }

                return throwError(() => error);
            })
        );
    }
}
