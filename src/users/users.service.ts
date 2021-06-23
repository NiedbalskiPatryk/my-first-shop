import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BasketService } from 'src/basket/basket.service';
import {
  RegisterUserResponse,
  SignUpUserResponse,
  IUser,
} from 'src/interface/IUser';
import { ShopService } from 'src/shop/shop.service';
import { hashPwd } from 'src/utilis/hash-pwd';
import { RegisterDto } from './dto/register.dto';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => ShopService)) private shopService: ShopService,
    @Inject(forwardRef(() => BasketService))
    private basketService: BasketService,
  ) {}

  async getUser(id: string): Promise<User> {
    return User.findOne(id);
  }

  filter(user: IUser): RegisterUserResponse {
    const { id, email } = user;
    return { id, email };
  }

  async signUpUser(newUser: RegisterDto): Promise<RegisterUserResponse> {
    const user = new User();

    user.email = newUser.email;
    user.pwdHash = hashPwd(newUser.pwd);

    await user.save();

    return this.filter(user);
  }
}
