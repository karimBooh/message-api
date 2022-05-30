import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as CryptoJS from 'crypto-js';
import { signupDto } from '../auth/dto/signup.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: signupDto): Promise<User> {
    return await this.usersRepository
      .save(this.usersRepository.create(user))
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  async findByLogin(identifier: string, password: string): Promise<User> {
    const encPwd: string = CryptoJS.SHA256(password).toString();
    return await this.usersRepository
      .createQueryBuilder()
      .where(
        'phone = :identifier OR email = :identifier AND password = :password',
        { identifier: identifier, password: encPwd },
      )
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException('User not found');
      });
  }

  async findByIdentifier(identifier: string): Promise<User> {
    return await this.usersRepository
      .createQueryBuilder()
      .where('phone = :identifier OR email = :identifier', {
        identifier: identifier,
      })
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException('User not found');
      });
  }

  async findByIdAndLastDisco(user: User): Promise<User> {
    const usr: User = await this.usersRepository
      .createQueryBuilder('user')
      .where({ id: user.id })
      .getOneOrFail()
      .catch(() => {
        throw new ForbiddenException();
      });

    const userDate = user.lastDisconnect ? new Date(user.lastDisconnect) : null;
    if (usr.lastDisconnect?.toString() != userDate?.toString()) {
      throw new ForbiddenException();
    }

    return usr;
  }

  async updateLastDisconnect(user: User): Promise<User> {
    user.lastDisconnect = new Date();
    await this.usersRepository
      .createQueryBuilder('user')
      .update(User)
      .set({
        lastDisconnect: user.lastDisconnect,
      })
      .where({ id: user.id })
      .execute()
      .catch(() => {
        throw new InternalServerErrorException();
      });

    return user;
  }
}
