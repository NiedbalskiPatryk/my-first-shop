import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Cache extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'longtext',
  })
  dataJson: string;

  @Column({
    length: 100,
  })
  @Index()
  controllerName: string;

  @Column({
    length: 100,
  })
  actionName: string;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
