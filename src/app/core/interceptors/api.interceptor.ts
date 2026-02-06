import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

const API_BASE_URL = 'http://localhost:3000';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const apiReq = req.url.startsWith('/')
    ? req.clone({ url: `${API_BASE_URL}${req.url}` })
    : req;

  return next(apiReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = error.status === 0
        ? 'Unable to connect to the server. Please check if the API is running.'
        : `Server error: ${error.status} ${error.statusText}`;

      console.error(`[API Error] ${req.method} ${req.url}:`, message);
      return throwError(() => error);
    })
  );
};
