import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConnectionOptions, Queue, QueueEvents, Worker } from 'bullmq';

@Injectable()
export class QueueService implements OnModuleInit {
  private readonly logger = new Logger(QueueService.name);
  private readonly connection: ConnectionOptions;

notificationQueue!: Queue;
webhookQueue!: Queue;
maintenanceQueue!: Queue;


  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.get<string>('queue.redisUrl') ?? 'redis://localhost:6379';
    const parsed = new URL(redisUrl);

    const connection: ConnectionOptions = {
      host: parsed.hostname,
      port: parsed.port ? Number(parsed.port) : 6379,
    };

    if (parsed.username) {
      connection.username = parsed.username;
    }

    if (parsed.password) {
      connection.password = parsed.password;
    }

    const dbPath = parsed.pathname?.replace('/', '') ?? '';
    const db = dbPath ? Number(dbPath) : undefined;

    if (typeof db === 'number' && !Number.isNaN(db)) {
      connection.db = db;
    }

    this.connection = connection;
  }

  async onModuleInit() {
    const queueOptions = { connection: this.connection };

    this.notificationQueue = new Queue('notifications', queueOptions);
    this.webhookQueue = new Queue('webhooks', queueOptions);
    this.maintenanceQueue = new Queue('maintenance', queueOptions);

    this.registerLogging(this.notificationQueue);
    this.registerLogging(this.webhookQueue);
    this.registerLogging(this.maintenanceQueue);
  }

  private registerLogging(queue: Queue) {
    const events = new QueueEvents(queue.name, { connection: this.connection });

    events.on('failed', ({ jobId, failedReason }) => {
      this.logger.error(`Job ${jobId} failed in ${queue.name}: ${failedReason}`);
    });

    events.on('completed', ({ jobId }) => {
      this.logger.debug(`Job ${jobId} completed in ${queue.name}`);
    });
  }

  registerWorker(queue: Queue, handler: (job: any) => Promise<any>) {
    new Worker(
      queue.name,
      async (job) => {
        this.logger.debug(`Processing job ${job.name} in ${queue.name}`);
        return handler(job);
      },
      { connection: this.connection },
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
