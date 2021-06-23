import { ItemInBasket } from 'src/basket/basket.entity';
import { IShopItem } from 'src/interface/IShop';
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
import { ShopItemDetails } from './shop-item-details.entity';
import { ShopSet } from './shop-set.entity';

@Entity()
export class ShopItem extends BaseEntity implements IShopItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 60,
  })
  name: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({
    type: 'float',
    precision: 6,
    scale: 2,
  })
  price: number;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    default: 0,
  })
  boughtCounter: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  wasEverBought: boolean;

  @Column({
    default: null,
    nullable: true,
  })
  photoFn: string;

  @OneToOne(() => ShopItemDetails, { eager: true })
  @JoinColumn()
  details: ShopItemDetails;

  // Subprodukt //

  @ManyToOne((type) => ShopItem, (entity) => entity.subShopItems)
  mainShopItem: ShopItem;

  // Produkt główny //

  @OneToMany((type) => ShopItem, (entity) => entity.mainShopItem)
  subShopItems: ShopItem[];

  @ManyToMany((type) => ShopSet, (entity) => entity.items)
  @JoinTable()
  sets: ShopSet[];

  @ManyToMany((type) => ItemInBasket, (entity) => entity)
  basketItem: ItemInBasket;

  @OneToMany((type) => ItemInBasket, (entity) => entity.shopItem)
  itemInBasket: ItemInBasket[];
}
