import { forwardRef, Module } from '@nestjs/common';
import { BasketModule } from 'src/basket/basket.module';
import { BasketService } from 'src/basket/basket.service';
import { ShopModule } from 'src/shop/shop.module';
import { ShopService } from 'src/shop/shop.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [forwardRef(() => BasketModule), forwardRef(() => ShopModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
