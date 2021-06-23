import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of, throwError, TimeoutError } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';

@Injectable()
export class MyCacheInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const method = context.getHandler();
    const cachedData = this.reflector.get<any>('cacheData', method);
    const cachedTime = this.reflector.get<Date>('cachTime', method);

    if (cachedData && +cachedTime + 10000 > +new Date()) {
      console.log('Used cache data');
      return of(cachedData);
    } else {
      console.log('Generating live data');
      return next.handle().pipe(
        tap((data) => {
          console.log('Dane z cache', cachedData);

          Reflect.defineMetadata('cacheData', data, method);
          Reflect.defineMetadata('cachTime', new Date(), method);
        }),
      );
    }
  }
}
