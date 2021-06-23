import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';

import { RegisterUserResponse, IUser } from 'src/interface/IUser';

import { RegisterDto } from './dto/register.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersService) private userService: UsersService, // @Inject(ShopService) private shopService: ShopService, // @Inject(BasketService) private basketService: BasketService,
  ) {}

  @Get('/:id')
  getUser(@Param('id') id: string): Promise<IUser> {
    return this.userService.getUser(id);
  }

  @Post('/register')
  signUpUser(@Body() newUser: RegisterDto): Promise<RegisterUserResponse> {
    return this.userService.signUpUser(newUser);
  }
}
