import {HttpContextToken, HttpInterceptorFn} from "@angular/common/http";
import {catchError, EMPTY, throwError} from "rxjs";
import {inject} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";

export const BYPASS_ERROR_INTERCEPTOR = new HttpContextToken<boolean>(() => false);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const matSnackBar = inject(MatSnackBar);
  return next(req).pipe(
    catchError((error) => {
      if (req.context.get(BYPASS_ERROR_INTERCEPTOR)) {
        return throwError(() => error);
      }
      matSnackBar.open(error.message, "OK");
      return EMPTY;
    })
  );
};
