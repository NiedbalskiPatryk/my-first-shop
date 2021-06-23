import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShopItem } from './shop-Item.entity';

@Entity()
export class ShopSet extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 50,
  })
  name: string;

  @ManyToMany((type) => ShopItem, (entity) => entity.sets)
  items: ShopItem;
}
