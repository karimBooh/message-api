import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { Chat, ChatType } from './chat.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
  ) {}

  async getByAttendees(attendees: User[]): Promise<Chat | void> {
    const test = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.attendees', 'user')
      .getMany()
      .catch(() => {
        throw new InternalServerErrorException();
      });
    for (const chat of test) {
      if (attendees.length == chat.attendees.length) {
        const containsAll = chat.attendees.every((element) => {
          if (attendees.findIndex((elem) => elem.id == element.id) > -1) {
            return true;
          }
        });
        if (containsAll) {
          return chat;
        }
      }
    }
    return;
  }

  async createChat(
    attendees: User[],
    createBy: User,
    chatType: ChatType,
  ): Promise<Chat> {
    const chat = this.chatRepository.create({
      attendees: attendees,
      chatType: chatType,
      createAt: new Date(),
    });
    return await this.chatRepository.save(chat).catch(() => {
      throw new InternalServerErrorException('Can not send a message');
    });
  }
}
