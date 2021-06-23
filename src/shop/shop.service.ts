import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BasketService } from 'src/basket/basket.service';

import { IProduct } from 'src/interface/IProduct';
import {
  IGetListOfProductsResponse,
  IGetOneProductResponse,
  IGetPaginatedListOfProductResponse,
  IShopItem,
} from 'src/interface/IShop';

import { MulterDiskUploadedFiles } from 'src/interface/MulterDiskUploadedFiles';
import { getConnection, LessThan, Not } from 'typeorm';
import { AddProductDto } from './dto/add-product.dto';
import { ShopItemDetails } from './shop-item-details.entity';

import { ShopItem } from './shop-Item.entity';
import * as fs from 'fs';
import * as path from 'path';
import { storageDir } from 'src/utilis/storage';

@Injectable()
export class ShopService {
  constructor(
    @Inject(forwardRef(() => BasketService))
    private basketService: BasketService,
  ) {}

  async hasProduct(product: IProduct): Promise<boolean> {
    const products = this.getProducts();

    return (await products).items.some(
      (shopProduct) => shopProduct.name === product.name,
    );
  }

  async removeOneProduct(id: string) {
    await ShopItem.delete(id);
  }

  async getProducts(
    currentPage = 1,
  ): Promise<IGetPaginatedListOfProductResponse> {
    const maxPerPage = 3;

    const [items, count] = await ShopItem.findAndCount({
      // relations: ['details', 'sets'],
      skip: maxPerPage * (currentPage - 1),
      take: maxPerPage,
    });

    const pagesCount = Math.ceil(count / maxPerPage);

    return { items, pagesCount };
  }

  filter(shopItem: ShopItem): IShopItem {
    const { id, price, description, name } = shopItem;
    return { id, price, description, name };
  }

  async getItems(): Promise<IShopItem[]> {
    return (await ShopItem.find()).map(this.filter);
  }

  async getOneProduct(id: string): Promise<ShopItem> {
    return ShopItem.findOneOrFail(id);
  }

  async createDummyProduct(): Promise<ShopItem> {
    const newItem = new ShopItem();
    newItem.price = 2.99;
    newItem.name = 'Woda';
    newItem.description = 'Troche tlenu i wodoru';

    await newItem.save();

    const details = new ShopItemDetails();
    details.color = 'transparent';
    details.width = 30;

    await details.save();

    newItem.details = details;

    await newItem.save();

    return newItem;
  }

  async addBoughtCounter(id: string) {
    await ShopItem.update(id, {
      wasEverBought: true,
    });

    const item = await ShopItem.findOneOrFail(id);

    item.boughtCounter++;

    await item;
  }

  async findProducts(searchTerm: string): Promise<IGetListOfProductsResponse> {
    // // Metoda tego typu słuzy do agregacji danych czyli np. zliczenia ilości danych:
    // const { count } = await getConnection()
    //   .createQueryBuilder()
    //   .select(`COUNT(shopItem.id)`, 'count')
    //   .from(ShopItem, 'shopItem')
    //   .getRawOne();
    // console.log(count);
    // //! Koniec

    // // Pobieranie za pomocą Query Buildera :
    // return await getConnection()
    //   .createQueryBuilder()
    //   .select('shopItem')
    //   .from(ShopItem, 'shopItem')
    //   .where('shopItem.description LIKE :searchTerm', {
    //     searchTerm: `%${searchTerm}%`,
    //   })
    //   .orderBy('shopItem.id', 'ASC')
    //   .skip(0)
    //   .take(5)
    //   .getMany();
    // //! Koniec

    // Tutaj prostsze wyszukiwanie :
    return await ShopItem.find({
      // select: [],
      // where: [{ description: 'tea tea tea' }, { price: 100 }],
      // where: { description: Like(`%${searchTerm}%`) },
      // where: { id: In([1, 5]) },
    });
  }

  async addProduct(
    req: AddProductDto,
    files: MulterDiskUploadedFiles,
  ): Promise<IShopItem> {
    const photo = files?.photo?.[0] ?? null;

    try {
      const shopItem = new ShopItem();
      shopItem.name = req.name;
      shopItem.description = req.description;
      shopItem.price = req.price;

      if (photo) {
        shopItem.photoFn = photo.filename;
      }

      await shopItem.save();

      return this.filter(shopItem);
    } catch (e) {
      try {
        if (photo) {
          fs.unlinkSync(
            path.join(storageDir(), 'product-photos', photo.filename),
          );
        }
      } catch (e2) {}

      throw e;
    }
  }

  async getPhoto(id: string, res: any) {
    try {
      const one = await ShopItem.findOne(id);

      if (!one) {
        throw new Error('No object found!');
      }

      if (!one.photoFn) {
        throw new Error('No photo in this entity!');
      }

      res.sendFile(one.photoFn, {
        root: path.join(storageDir(), 'product-photos'),
      });
    } catch (e) {
      res.json({
        error: e.message,
      });
    }
  }
  //MongoDB
  // async createDummyProduct(): Promise<ShopItemInterface> {
  //   const newItem = await this.itemShopModel.create({
  //     name: 'Produkt',
  //     price: 150,
  //     description: 'Produktowi nie równy',
  //     boughtCounter: 7,
  //     createdAd: new Date(),
  //     wasEverBought: true,
  //   });

  //   return newItem.save();
  // }

  // async getOneProduct(id: string): Promise<ShopItemInterface> {
  //   return this.itemShopModel.findById(id).exec();
  // }

  // async getProducts(
  //   currentPage = 1,
  // ): Promise<GetPaginatedListOfProductResponse> {
  //   const PRODUCT_QUANTITY_PER_PAGE = 3;

  //   const products = await this.itemShopModel
  //     .find()
  //     .limit(PRODUCT_QUANTITY_PER_PAGE)
  //     .skip(currentPage * PRODUCT_QUANTITY_PER_PAGE)
  //     .exec();

  //   const totalNumber = await this.itemShopModel.countDocuments();

  //   return {
  //     items: products,
  //     pagesCount: Math.round(totalNumber / PRODUCT_QUANTITY_PER_PAGE),
  //   };
  // }
}
