import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

import { BasketModule } from './basket/basket.module';
import { ShopModule } from './shop/shop.module';
import { UsersModule } from './users/users.module';
import { CacheModule } from './cache/cache.module';
import { DiscountCodeModule } from './discount-code/discount-code.module';
import { CronModule } from './cron/cron.module';
import { MailModule } from './mail/mail.module';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    BasketModule,
    ShopModule,
    UsersModule,
    CacheModule,
    DiscountCodeModule,
    CronModule,
    MailModule,
    AuthModule,
    // MongooseModule.forRoot(
    //   'mongodb+srv://root:root@my-first-shop.fvofi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    // ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
