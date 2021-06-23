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

import { Cache } from '../cache/cache.entity';

@Injectable()
export class MyTestInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const method = context.getHandler();
    const cacheTimeInSec = this.reflector.get<number>('cacheTime', method);
    const controllerName = context.getClass().name;
    const actionName = method.name;
    const cachedData = await Cache.findOne({
      where: {
        controllerName,
        actionName,
      },
    });

    if (cachedData) {
      if (+cachedData.createdAt + cacheTimeInSec + 10000 > +new Date()) {
        console.log('Used cached data');
        return of(JSON.parse(cachedData.dataJson));
      } else {
        console.log('Removing old cache data', cachedData.id);
        await cachedData.remove();
      }
    }

    console.log('Generating live data');
    return next.handle().pipe(
      tap(async (data) => {
        const cache = new Cache();

        cache.controllerName = controllerName;
        cache.actionName = actionName;
        cache.dataJson = JSON.stringify(data);

        await cache.save();
      }),
    );
  }
}
