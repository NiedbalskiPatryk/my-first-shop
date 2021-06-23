import { forwardRef, Module } from '@nestjs/common';
import { BasketModule } from 'src/basket/basket.module';
import { UsersModule } from 'src/users/users.module';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemShop, ItemShopSchema } from 'src/interface/shop-item.schema';

@Module({
  imports: [
    forwardRef(() => BasketModule),
    forwardRef(() => UsersModule),
    // MongooseModule.forFeature([
    //   { name: ItemShop.name, schema: ItemShopSchema },
    // ]),
  ],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
