import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  LoadEvent,
  RemoveEvent,
  TransactionCommitEvent,
  TransactionRollbackEvent,
  TransactionStartEvent,
  UpdateEvent,
} from 'typeorm';
import { Message } from './message.entity';

@EventSubscriber()
export class MessageSubscriber implements EntitySubscriberInterface<Message> {
  listenTo() {
    return Message;
  }

  afterLoad(entity: Message) {
    ///TODO
  }
}
