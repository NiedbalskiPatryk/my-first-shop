import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  GetBasketStatsResponse,
  IGetTotalPriceResponse,
  IBasketResponse,
  IProductInBasket,
} from 'src/interface/IBasket';

import { AddProductDto } from './dto/add-product.dto';
import { ItemInBasket } from './basket.entity';
import { ShopService } from 'src/shop/shop.service';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mail/mail.service';
import { getConnection } from 'typeorm';
import { addedToBasketInfoEmailTemplate } from 'src/templates/email/added-to-basket-info';
import { User } from 'src/users/users.entity';

@Injectable()
export class BasketService {
  constructor(
    @Inject(forwardRef(() => ShopService)) private shopService: ShopService,
    @Inject(forwardRef(() => UsersService)) private userService: UsersService,
    @Inject(MailService) private mailService: MailService,
  ) {}

  async getAllForUser(userId: string): Promise<IProductInBasket[]> {
    const user = await this.userService.getUser(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return await ItemInBasket.find({
      where: {
        user,
      },
      relations: ['shopItem'],
    });
  }

  async getAllForAdmin(): Promise<IProductInBasket[]> {
    return await ItemInBasket.find({
      relations: ['shopItem', 'user'],
    });
  }

  async addProduct(
    product: AddProductDto,
    user: User,
  ): Promise<IBasketResponse> {
    const { count, productId } = product;

    const shopItem = await this.shopService.getOneProduct(productId);

    if (
      typeof productId !== 'string' ||
      productId === '' ||
      typeof count !== 'number' ||
      count < 1 ||
      !shopItem
    ) {
      return { isSuccess: false };
    } else {
      const item = new ItemInBasket();

      item.count = count;

      await item.save();

      item.shopItem = shopItem;
      item.user = user;

      await item.save();

      this.shopService.addBoughtCounter(productId);

      await this.mailService.sendMail(
        user.email,
        'Dziękujemy za dodanie do koszyka',
        addedToBasketInfoEmailTemplate(),
      );

      return { isSuccess: true, id: item.id };
    }
  }

  async removeItem(
    itemInBasketId: string,
    userId: string,
  ): Promise<{ isSuccess: boolean }> {
    const user = await this.userService.getUser(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const item = await ItemInBasket.findOne({
      where: {
        id: itemInBasketId,
        user,
      },
    });

    if (item) {
      await item.remove();
      return { isSuccess: true };
    } else {
      return { isSuccess: false };
    }
  }

  async clearBasket(userId: string) {
    const user = await this.userService.getUser(userId);

    if (!user) {
      throw new Error('User not found');
    }

    await ItemInBasket.delete({ user });
  }

  async getTotalPrice(userId: string): Promise<IGetTotalPriceResponse> {
    const basketItems = await this.getAllForUser(userId);

    if (await !basketItems.every((item) => this.shopService.hasProduct(item))) {
      return { isSuccess: false };
    }

    return (
      await Promise.all(
        basketItems.map(
          async (item) => item.shopItem.price * item.count * 1.23,
        ),
      )
    ).reduce((prev, curr) => prev + curr, 0);
  }

  async countPromo(userId: string): Promise<number> {
    return (await this.getTotalPrice(userId)) > 10 ? 1 : 0;
  }

  async getStats(): Promise<GetBasketStatsResponse> {
    const allItemsInBasket = await this.getAllForAdmin();

    const baskets: {
      [userId: string]: number;
    } = {};

    for (const oneItemInBasket of allItemsInBasket) {
      baskets[oneItemInBasket.user.id] = baskets[oneItemInBasket.user.id] || 0;

      baskets[oneItemInBasket.user.id] +=
        oneItemInBasket.shopItem.price * oneItemInBasket.count * 1.23;
    }

    const basketValues = Object.values(baskets);

    const basketAvgTotalPrice =
      basketValues.reduce((prev, current) => prev + current, 0) /
      basketValues.length;

    // const { itemInBasketAvgPrice } = await getConnection()
    //   .createQueryBuilder()
    //   .select('AVG(shopItem.price)', 'itemInBasketAvgPrice')
    //   .from(ItemInBasket, 'itemInBasket')
    //   .leftJoinAndSelect('itemInBasket.shopItem', 'shopItem')
    //   .getRawOne();

    return {
      itemInBasketAvgPrice: 0,
      basketAvgTotalPrice: basketAvgTotalPrice,
    };
  }
}
