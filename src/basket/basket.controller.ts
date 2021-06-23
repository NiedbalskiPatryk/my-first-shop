import {
  Body,
  Controller,
  Inject,
  Post,
  Delete,
  Param,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsePassword } from 'src/decorators/use-password.decorator';
import { UseCacheTime } from 'src/decorators/use-cache-time.decorator';
import { PasswordProtectGuard } from 'src/guards/password-protect.guard';
import { MyCacheInterceptor } from 'src/interceptors/my-cache.interceptor';
import { MyTimeoutInterceptor } from 'src/interceptors/my-timeout.interceptor';
import { MyTestInterceptor } from 'src/interceptors/test.interceptor';
import {
  IGetBasketResponse,
  GetBasketStatsResponse,
  IGetTotalPriceResponse,
} from 'src/interface/IBasket';

import { BasketService } from './basket.service';
import { AddProductDto } from './dto/add-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from 'src/decorators/user-object.decorator';
import { User } from 'src/users/users.entity';

@Controller('basket')
export class BasketController {
  constructor(@Inject(BasketService) private basketService: BasketService) {}

  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  addProduct(
    @Body() product: AddProductDto,
    @UserObj() user: User,
  ): Promise<{
    isSuccess: boolean;
    index?: number;
  }> {
    return this.basketService.addProduct(product, user);
  }

  @Get('/admin')
  @UseGuards(PasswordProtectGuard)
  @UsePassword('admin1')
  getAllForAdmin(): Promise<IGetBasketResponse> {
    return this.basketService.getAllForAdmin();
  }

  @Get('/stats')
  @UseGuards(PasswordProtectGuard)
  @UsePassword('stats1')
  @UseInterceptors(MyTimeoutInterceptor, MyCacheInterceptor)
  @UseInterceptors(MyTestInterceptor)
  @UseCacheTime(5)
  getStats(): Promise<GetBasketStatsResponse> {
    return this.basketService.getStats();
  }

  @Get('/:userId')
  getBasket(@Param('userId') userId: string): Promise<IGetBasketResponse> {
    return this.basketService.getAllForUser(userId);
  }

  @Delete('/:itemInBasketId/:userId')
  deleteProduct(
    @Param('itemInBasketId') itemInBasketId: string,
    @Param('userId') userId: string,
  ): Promise<{
    isSuccess: boolean;
  }> {
    return this.basketService.removeItem(itemInBasketId, userId);
  }

  @Delete('/delete/all/:userId')
  clearBasket(@Param('userId') userId: string) {
    return this.basketService.clearBasket(userId);
  }

  @Get(`/total/price/:userId`)
  getTotalPrice(
    @Param('userId') userId: string,
  ): Promise<IGetTotalPriceResponse> {
    return this.basketService.getTotalPrice(userId);
  }
}
