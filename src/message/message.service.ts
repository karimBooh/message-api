import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat, ChatType } from '../chat/chat.entity';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../user/user.entity';
import { ChatService } from '../chat/chat.service';
import { Utils } from '../utils/Utils';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    private readonly _chatService: ChatService,
    private _utils: Utils,
  ) {}

  async sendToChat(
    to: User,
    from: User,
    message: MessageDto,
  ): Promise<Message> {
    let chat: Chat | void = await this._chatService.getByAttendees([to, from]);
    if (!chat) {
      const chatType: ChatType = this._utils.getMessageType(from, to);
      chat = await this._chatService.createChat([to, from], from, chatType);
    }

    const msg: Message = this.messageRepository.create({
      ...message,
      chat,
      createBy: from,
    });
    return this.messageRepository.save(msg).catch((error) => {
      throw new BadRequestException(error.message);
    });
  }

  async getById(id: number): Promise<Message> {
    return this.messageRepository
      .createQueryBuilder('message')
      .where('message.deleted = false')
      .leftJoinAndSelect('message.createBy', 'createBy')
      .leftJoinAndSelect('message.seenByUser', 'seen')
      .leftJoinAndSelect('message.chat', 'chat')
      .leftJoinAndSelect('chat.attendees', 'user')
      .andWhere({ id: id })
      .getOneOrFail()
      .catch(() => {
        throw new BadRequestException('Message not found');
      });
  }

  async getMyMessage(id: number): Promise<Message[]> {
    return this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.seenByUser', 'seen')
      .leftJoinAndSelect('message.createBy', 'user')
      .where('user.id = :id AND message.deleted = false', { id: id })
      .getMany()
      .catch(() => {
        throw new BadRequestException('Message not found');
      });
  }

  async editMessage(
    messageId: number,
    message: string,
    userId: number,
  ): Promise<Message> {
    const msg = await this.messageRepository
      .createQueryBuilder('message')
      .where({ id: messageId, deleted: false })
      .leftJoinAndSelect('message.createBy', 'usr')
      .andWhere('usr.id = :id', { id: userId })
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException("Can't found message");
      });
    if (msg.createBy.id != userId) {
      throw new ForbiddenException();
    }
    await this.messageRepository
      .createQueryBuilder('message')
      .update(Message)
      .set({
        message: message,
      })
      .where({ id: messageId })
      .execute()
      .catch(() => {
        throw new InternalServerErrorException();
      });
    msg.message = message;
    return msg;
  }

  async updateSeenMessage(messageId: number, user: User): Promise<Message> {
    const message = await this.messageRepository
      .createQueryBuilder('message')
      .where({ id: messageId, deleted: false })
      .leftJoinAndSelect('message.seenByUser', 'user')
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException('Message not found');
      });
    message.seenByUser.push(user);
    await this.messageRepository.save(message).catch(() => {
      throw new InternalServerErrorException();
    });

    return message;
  }

  async deleteById(id: number): Promise<boolean> {
    await this.messageRepository
      .createQueryBuilder('message')
      .update(Message)
      .set({
        deleted: true,
      })
      .where('id = :id', { id: id })
      .execute()
      .catch(() => {
        throw new InternalServerErrorException("Can't delete this message");
      });
    return true;
  }
}
