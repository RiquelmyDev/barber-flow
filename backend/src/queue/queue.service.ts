import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, QueueEvents, Worker } from 'bullmq';

@Injectable()
export class QueueService implements OnModuleInit {
  private readonly logger = new Logger(QueueService.name);
  private readonly connection: { connection: { url: string } };

  notificationQueue!: Queue;
  webhookQueue!: Queue;
  maintenanceQueue!: Queue;

  constructor(private readonly configService: ConfigService) {
    this.connection = {
      connection: { url: this.configService.get<string>('queue.redisUrl') ?? 'redis://localhost:6379' },
    };
  }

  onModuleInit() {
    this.notificationQueue = new Queue('notifications', this.connection);
    this.webhookQueue = new Queue('webhooks', this.connection);
    this.maintenanceQueue = new Queue('maintenance', this.connection);

    this.registerLogging(this.notificationQueue);
    this.registerLogging(this.webhookQueue);
    this.registerLogging(this.maintenanceQueue);
  }

  private registerLogging(queue: Queue) {
    const events = new QueueEvents(queue.name, this.connection);
    events.on('failed', ({ jobId, failedReason }) => {
      this.logger.error(`Job ${jobId} failed in ${queue.name}: ${failedReason}`);
    });
    events.on('completed', ({ jobId }) => {
      this.logger.debug(`Job ${jobId} completed in ${queue.name}`);
    });
    new Worker(
      queue.name,
      async (job) => {
        this.logger.debug(`Processing job ${job.name} in ${queue.name}`);
      },
      this.connection,
    );
  }

  async enqueueNotification(data: any, delayMs = 0) {
    return this.notificationQueue.add('sendNotification', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 60_000 },
      delay: delayMs,
    });
  }

  async enqueueWebhook(data: any) {
    return this.webhookQueue.add('deliverWebhook', data, {
      attempts: 3,
      backoff: { type: 'fixed', delay: 60_000 },
    });
  }

  async scheduleMaintenance(task: string, data: any, delayMs: number) {
    return this.maintenanceQueue.add(task, data, { delay: delayMs });
  }
}
