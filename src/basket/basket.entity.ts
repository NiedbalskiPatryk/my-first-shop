import { IUser } from 'src/interface/IUser';
import { ShopItem } from 'src/shop/shop-Item.entity';
import { User } from 'src/users/users.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AddProductDto } from './dto/add-product.dto';

@Entity()
export class ItemInBasket extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  count: number;

  @ManyToOne((type) => ShopItem, (entity) => entity.itemInBasket)
  @JoinColumn()
  shopItem: ShopItem;

  @ManyToOne((type) => User, (entity) => entity.itemsInBasket)
  @JoinColumn()
  user: User;
}
