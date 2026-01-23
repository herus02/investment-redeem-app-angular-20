import { HttpInterceptorFn, HttpEvent, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const modifiedReq = req.clone({
    setHeaders: {
      'x-token': 'token-valor'
    }
  });

  return next(modifiedReq).pipe(
    map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse && event.body) {
        const body = event.body;
        if (body.response?.data?.listaInvestimentos !== undefined) {
          return event.clone({
            body: body.response.data.listaInvestimentos
          });
        }
        if (body.data?.listaInvestimentos !== undefined) {
          return event.clone({
            body: body.data.listaInvestimentos
          });
        }
      }
      return event;
    })
  );
};
