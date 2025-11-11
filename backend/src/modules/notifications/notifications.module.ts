import { Module } from '@nestjs/common';

import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { EmailService } from '../../integrations/email.service';
import { WhatsappService } from '../../integrations/whatsapp.service';
import { QueueModule } from '../../queue/queue.module';

@Module({
  imports: [QueueModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, EmailService, WhatsappService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
