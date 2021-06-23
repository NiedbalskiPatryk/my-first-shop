import { ShopItem } from 'src/shop/shop-Item.entity';
import { User } from 'src/users/users.entity';

export interface IProductInBasket {
  id: string;
  count: number;
  shopItem: ShopItem;
  user: User;
}

export interface IBasketResponse {
  id?: string;
  isSuccess: boolean;
}

export type IGetTotalPriceResponse =
  | number
  | {
      isSuccess: false;
    };

export type IGetBasketResponse = IProductInBasket[];

export interface GetBasketStatsResponse {
  itemInBasketAvgPrice: number;
  basketAvgTotalPrice: number;
}
