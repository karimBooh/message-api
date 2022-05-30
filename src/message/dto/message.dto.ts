import { User } from '../../user/user.entity';

export class MessageDto {
  message: string;
  id: number;
  createAt: Date;
  createBy: User;
  seenByUser: User[];
}
