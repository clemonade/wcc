import {HttpContextToken, HttpInterceptorFn} from "@angular/common/http";
import {finalize} from "rxjs";
import {inject} from "@angular/core";
import {LoadingService} from "../services/loading.service";

export const BYPASS_LOADING_INTERCEPTOR = new HttpContextToken<boolean>(() => false);

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  if (req.context.get(BYPASS_LOADING_INTERCEPTOR)) {
    return next(req);
  }

  loadingService.loading$.next(loadingService.loading$.value + 1);

  return next(req).pipe(
    finalize(() => {
      loadingService.loading$.next(loadingService.loading$.value - 1);
    })
  );
};
