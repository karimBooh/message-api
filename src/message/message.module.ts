import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { ChatModule } from '../chat/chat.module';
import { UserModule } from '../user/user.module';
import { Utils } from '../utils/Utils';

@Module({
  imports: [ChatModule, UserModule, TypeOrmModule.forFeature([Message])],
  providers: [MessageService, Utils],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessageModule {}
