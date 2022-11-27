import { Injectable } from '@nestjs/common';
import {
  ServiceBusClient,
  ServiceBusMessage,
  ServiceBusSender,
} from '@azure/service-bus';

@Injectable()
export class AppService {
  sender: ServiceBusSender;
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
    const sender = sbClient.createSender(queueName);
    this.sbClient = sbClient;
    this.sender = sender;
  }

  async sendMessages() {
    console.log(`Sending the first 5 scientists (as an array)`);
    try {
      await this.sender.sendMessages(this.firstSetOfMessages);
    } finally {
    }
  }
}
