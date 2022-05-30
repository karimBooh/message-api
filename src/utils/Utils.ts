import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { ChatType } from '../chat/chat.entity';

@Injectable()
export class Utils {
  constructor() {}

  getMessageType(from: User, to: User): ChatType {
    if (to.phone && from.phone) {
      return ChatType.Phone;
    } else if (to.email && from.email) {
      return ChatType.Email;
    } else throw new BadRequestException("Can't send to this receiver");
  }
}
