import { SetMetadata } from '@nestjs/common';

export const UseCacheTime = (cacheTimeInSec: number) =>
  SetMetadata('cacheTime', cacheTimeInSec);
