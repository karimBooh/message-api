import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt.guard';
import { ChatModule } from './chat/chat.module';
import { Chat } from './chat/chat.entity';
import { MessageModule } from './message/message.module';
import { Message } from './message/message.entity';
import { Utils } from './utils/Utils';
import { MessageSubscriber } from './message/message.subscriber';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DB_USR,
      password: process.env.DB_PWD,
      database: 'messagingapi',
      entities: [User, Chat, Message],
      subscribers: [MessageSubscriber],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    ChatModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    Utils,
  ],
})
export class AppModule {}
