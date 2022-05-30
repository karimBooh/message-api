import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as CryptoJS from 'crypto-js';
import { IsEmail, IsPhoneNumber } from 'class-validator';
import { IsPassword } from '../utils/decorator/is-password';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @IsPassword({
    message:
      'The password need to contain at least 8 characters with special character and number with Uppercase and lowercase',
  })
  @Column({
    transformer: {
      to: (value: string) => CryptoJS.SHA256(value).toString(),
      from: (value: string) => value,
    },
    select: false,
  })
  password: string;

  @Column({ unique: true, nullable: true })
  phone?: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ type: 'timestamp without time zone', nullable: true})
  lastDisconnect?: Date;
}
