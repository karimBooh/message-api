import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ChatService } from '../chat/chat.service';
import { UserService } from '../user/user.service';
import { Utils } from '../utils/Utils';
import { User } from '../user/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MessageService } from './message.service';
import { Message } from './message.entity';
import { MessageDto } from './dto/message.dto';

@ApiTags('message')
@ApiBearerAuth()
@Controller('message')
export class MessageController {
  constructor(
    private readonly _chatService: ChatService,
    private readonly _userService: UserService,
    private readonly _messageService: MessageService,
    private _utils: Utils,
  ) {}

  @Get('/me')
  getAllMessage(@Req() req: Request): Promise<Message[]> {
    return this._messageService.getMyMessage((req.user as User).id);
  }

  @Get('/:id')
  async getMessage(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Message> {
    const message: Message = await this._messageService.getById(id);
    const index = message.chat.attendees.findIndex(
      (attendee) => attendee.id == (req.user as User).id,
    );
    if (index < 0) {
      throw new ForbiddenException('You can not access to this message');
    }
    return message;
  }

  @Post('sendTo/:identifier')
  async createMessage(
    @Req() req: Request,
    @Param('identifier') identifier: string,
    @Body() message: MessageDto,
  ): Promise<MessageDto> {
    const to: User = await this._userService.findByIdentifier(identifier);
    return this._messageService.sendToChat(to, req.user as User, message);
  }

  @Put('editMessage/:id')
  async editMessage(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() message: MessageDto,
  ): Promise<Message> {
    return await this._messageService.editMessage(
      id,
      message.message,
      (req.user as User).id,
    );
  }

  @Put('seenMessage/:id')
  async seenMessage(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this._messageService.updateSeenMessage(id, req.user as User);
  }

  @Delete(':id')
  async removeMessage(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const message = await this._messageService.getById(id);
    const index = message.chat.attendees.findIndex(
      (attendee) => attendee.id == (req.user as User).id,
    );
    if (index < 0) {
      throw new ForbiddenException('You can not delete to this message');
    }

    await this._messageService.deleteById(id);
    return res.status(HttpStatus.OK).send();
  }
}
