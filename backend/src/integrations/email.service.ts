import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly apiKey: string;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('sendgrid.apiKey') ?? '';
    this.fromEmail = this.configService.get<string>('sendgrid.fromEmail') ?? 'no-reply@barberflow.app';
  }

  async sendEmail(to: string, subject: string, html: string) {
    if (!this.apiKey) {
      this.logger.warn('SendGrid API key not configured, skipping email');
      return { skipped: true };
    }

    try {
      await axios.post(
        'https://api.sendgrid.com/v3/mail/send',
        {
          personalizations: [
            {
              to: [{ email: to }],
            },
          ],
          from: { email: this.fromEmail, name: 'BarberFlow' },
          subject,
          content: [{ type: 'text/html', value: html }],
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return { success: true };
    } catch (error) {
      this.logger.error('Failed to send email', error as any);
      return { success: false, error };
    }
  }
}
