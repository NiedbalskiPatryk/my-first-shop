import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import {
  ICreateProductResponse,
  IGetListOfProductsResponse,
  IGetOneProductResponse,
  IGetPaginatedListOfProductResponse,
  IShopItem,
} from 'src/interface/IShop';
import { MulterDiskUploadedFiles } from 'src/interface/MulterDiskUploadedFiles';
import { CheckAgePipe } from 'src/pipes/check-age.pipe';
import { multerStorage, storageDir } from 'src/utilis/storage';
import { AddProductDto } from './dto/add-product.dto';

import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {
  constructor(@Inject(ShopService) private shopService: ShopService) {}

  @Get('/find/:searchTerm')
  testFindItem(
    @Param('searchTerm') searchTerm: string,
  ): Promise<IGetListOfProductsResponse> {
    return this.shopService.findProducts(searchTerm);
  }

  @Get('/:id')
  getProduct(@Param('id') id: string): Promise<IGetOneProductResponse> {
    return this.shopService.getOneProduct(id);
  }

  @Get('/all/:pageNumber')
  getListOfProducts(
    @Param('pageNumber') pageNumber: string,
  ): Promise<IGetPaginatedListOfProductResponse> {
    return this.shopService.getProducts(Number(pageNumber));
  }

  @Delete('/:id')
  removeProduct(@Param('id') id: string) {
    return this.shopService.removeOneProduct(id);
  }

  @Post('/')
  createNewProduct(): Promise<ICreateProductResponse> {
    return this.shopService.createDummyProduct();
  }

  @Get('/test/:age')
  test(
    @Param(
      'age',
      new CheckAgePipe({
        minAge: 18,
      }),
    )
    age: number,
  ) {
    return console.log(age);
  }

  @Get('/testowy/test')
  testowy() {
    throw new Error('Damn');
  }

  @Post('/addProduct')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'photo',
          maxCount: 10,
        },
      ],
      { storage: multerStorage(path.join(storageDir(), 'product-photos')) },
    ),
  )
  addProduct(
    @Body() req: AddProductDto,
    @UploadedFiles() files: MulterDiskUploadedFiles,
  ): Promise<IShopItem> {
    return this.shopService.addProduct(req, files);
  }

  @Get('/photo/:id')
  async getPhoto(@Param('id') id: string, @Res() res: any): Promise<any> {
    return this.shopService.getPhoto(id, res);
  }
}
