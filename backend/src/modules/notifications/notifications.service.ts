import { Injectable } from '@nestjs/common';
import { NotificationStatus, NotificationTemplateType, NotificationChannel } from '@prisma/client';

import { EmailService } from '../../integrations/email.service';
import { WhatsappService } from '../../integrations/whatsapp.service';
import { PrismaService } from '../../prisma/prisma.service';
import { QueueService } from '../../queue/queue.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly whatsappService: WhatsappService,
    private readonly queueService: QueueService,
  ) {}

  async logNotification(data: any) {
    return this.prisma.notificationLog.create({ data });
  }

  async sendTestEmail(barbershopId: string, to: string) {
    const result = await this.emailService.sendEmail(
      to,
      'BarberFlow Test Email',
      '<p>This is a test email from BarberFlow.</p>',
    );
    await this.logNotification({
      barbershopId,
      channel: NotificationChannel.EMAIL,
      templateType: NotificationTemplateType.CONFIRMATION,
      status: result.success === false ? NotificationStatus.FAILED : NotificationStatus.SENT,
      responseCode: result.success === false ? '500' : '200',
      errorMessage: result.success === false ? JSON.stringify(result.error) : null,
      attemptsCount: 1,
    });
    return result;
  }

  async sendTestWhatsapp(barbershopId: string, to: string) {
    const result = await this.whatsappService.sendTemplateMessage({
      to,
      templateName: 'booking_confirmation',
    });
    await this.logNotification({
      barbershopId,
      channel: NotificationChannel.WHATSAPP,
      templateType: NotificationTemplateType.CONFIRMATION,
      status: result.success === false ? NotificationStatus.FAILED : NotificationStatus.SENT,
      responseCode: result.success === false ? '500' : '200',
      errorMessage: result.success === false ? JSON.stringify(result.error) : null,
      attemptsCount: 1,
    });
    return result;
  }

  enqueueReminder(payload: any, delayMs: number) {
    return this.queueService.enqueueNotification(payload, delayMs);
  }

  listLogs(barbershopId: string, page = 1, pageSize = 20) {
    return this.prisma.notificationLog.findMany({
      where: { barbershopId },
      orderBy: { lastAttemptAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }
}
