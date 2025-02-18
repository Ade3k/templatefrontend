import { HttpInterceptorFn } from '@angular/common/http';

export const JwtHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedRequest = req.clone({
    withCredentials: false, 
  });
  return next(clonedRequest);
};
