import { ItemInBasket } from 'src/basket/basket.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  pwdHash: string;

  @Column({ nullable: true, default: null })
  currentTokenId: string | null;

  @OneToMany((type) => ItemInBasket, (entity) => entity.user)
  itemsInBasket: ItemInBasket[];
}
