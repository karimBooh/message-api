import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Chat } from '../chat/chat.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @CreateDateColumn()
  createAt: Date;

  @ManyToOne(() => User)
  createBy: User;

  @ManyToOne(() => Chat, (chat) => chat.id)
  chat: Chat;

  @ManyToMany(() => User, (user) => user.id, {
    cascade: true,
  })
  @JoinTable()
  seenByUser: User[];

  @Column({ default: false })
  deleted: boolean;
}
