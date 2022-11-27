import { Injectable } from '@nestjs/common';
import {
  ServiceBusClient,
  ServiceBusMessage,
  ServiceBusReceiver,
} from '@azure/service-bus';

@Injectable()
export class AppService {
  queueReceiver: ServiceBusReceiver;
  sbClient: ServiceBusClient;
  firstSetOfMessages: ServiceBusMessage[] = [
    { body: 'Albert Einstein' },
    { body: 'Werner Heisenberg' },
    { body: 'Marie Curie' },
    { body: 'Steven Hawking' },
    { body: 'Isaac Newton' },
  ];

  constructor() {
    const connectionString = '<SAS>';
    const queueName = 'experimentacion-queue';
    const sbClient = new ServiceBusClient(connectionString);
    const queueReceiver = sbClient.createReceiver(queueName);
    this.sbClient = sbClient;
    this.queueReceiver = queueReceiver;
  }

  async receiveMessages() {
    try {
      const allMessages = [];
      const responses = [];
      console.log(`Receiving 5 messages...`);

      while (allMessages.length < 5) {
        // NOTE: asking for 5 messages does not guarantee that we will return
        // all 5 at once so we must loop until we get all the messages we expected.
        const messages = await this.queueReceiver.receiveMessages(5, {
          maxWaitTimeInMs: 60 * 1000,
        });

        if (!messages.length) {
          console.log('No more messages to receive');
          break;
        }

        console.log(`Received ${messages.length} messages`);
        allMessages.push(...messages);

        for (const message of messages) {
          console.log(`  Message: '${message.body}'`);
          responses.push(message.body);

          // completing the message will remove it from the remote queue or subscription.
          await this.queueReceiver.completeMessage(message);
        }
      }
      await this.queueReceiver.close();
      console.log(allMessages);
      return responses;
    } finally {
    }
  }
}
