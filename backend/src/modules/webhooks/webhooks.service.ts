import { Injectable } from '@nestjs/common';
import { randomBytes, createHmac } from 'crypto';
import axios from 'axios';

import { PrismaService } from '../../prisma/prisma.service';
import { QueueService } from '../../queue/queue.service';

@Injectable()
export class WebhooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queueService: QueueService,
  ) {}

  async listConfigs(barbershopId: string) {
    return this.prisma.webhookConfig.findMany({ where: { barbershopId } });
  }

  async upsertConfig(barbershopId: string, data: any) {
    if (!data.secret) {
      data.secret = randomBytes(16).toString('hex');
    }
    if (data.id) {
      return this.prisma.webhookConfig.update({
        where: { id: data.id },
        data,
      });
    }
    return this.prisma.webhookConfig.create({
      data: {
        ...data,
        barbershop: { connect: { id: barbershopId } },
      },
    });
  }

  async dispatchEvent(barbershopId: string, eventType: string, payload: any) {
    const configs = await this.prisma.webhookConfig.findMany({
      where: { barbershopId, isActive: true },
    });
    for (const config of configs) {
      const jobPayload = {
        webhookConfigId: config.id,
        barbershopId,
        eventType,
        url: config.url,
        payload,
        signature: this.signPayload(config.secret, payload),
      };
      await this.queueService.enqueueWebhook(jobPayload);
    }
  }

  async deliverWebhook(url: string, payload: any, signature: string) {
    await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-BarberFlow-Signature': signature,
      },
    });
  }

  private signPayload(secret: string, payload: any) {
    return createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');
  }
}
