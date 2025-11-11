import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendTemplateMessage(params: {
    to: string;
    templateName: string;
    languageCode?: string;
    components?: any[];
    accessToken?: string;
    phoneNumberId?: string;
  }) {
    const accessToken =
      params.accessToken ?? this.configService.get<string>('whatsapp.accessToken') ?? '';
    const phoneNumberId =
      params.phoneNumberId ?? this.configService.get<string>('whatsapp.phoneNumberId') ?? '';

    if (!accessToken || !phoneNumberId) {
      this.logger.warn('WhatsApp credentials missing, skipping');
      return { skipped: true };
    }

    try {
      await axios.post(
        `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: params.to,
          type: 'template',
          template: {
            name: params.templateName,
            language: { code: params.languageCode ?? 'pt_BR' },
            components: params.components,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return { success: true };
    } catch (error) {
      this.logger.error('Failed to send WhatsApp message', error as any);
      return { success: false, error };
    }
  }
}
