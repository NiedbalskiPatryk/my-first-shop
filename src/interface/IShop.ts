import { AddProductDto } from 'src/basket/dto/add-product.dto';

export interface IShopItem {
  name: string;
  description: string;
  price: number;
  id?: string;
  createdAt?: Date;
  boughtCounter?: number;
  wasEverBought?: boolean;
}

export type IGetListOfProductsResponse = IShopItem[];

export type IGetOneProductResponse = IShopItem;

export type ICreateProductResponse = IShopItem;

export interface IGetPaginatedListOfProductResponse {
  items: IShopItem[];
  pagesCount: number;
}
