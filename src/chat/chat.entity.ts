import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { User } from '../user/user.entity';

export enum ChatType {
  Email = 'Email',
  Phone = 'Phone',
}

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User, (user) => user.id)
  @JoinTable()
  attendees: User[];

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @Column({ type: 'enum', enum: ChatType })
  chatType: ChatType;

  @Column({ default: false })
  deleted: boolean;
}
