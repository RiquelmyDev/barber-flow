import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly bucket: string;
  private readonly region: string;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.get<string>('aws.bucket') ?? '';
    this.region = this.configService.get<string>('aws.region') ?? 'us-east-1';
  }

  async uploadBase64Image(base64: string, prefix = 'uploads') {
    const key = `${prefix}/${nanoid()}.png`;

    if (!this.bucket) {
      this.logger.warn(
        `S3 bucket not configured. Skipping upload for key ${key} and returning placeholder URL.`,
      );
      return `https://placeholder.local/${key}`;
    }

    this.logger.log(
      `Pretending to upload ${Buffer.byteLength(
        base64,
        'base64',
      )} bytes to s3://${this.bucket}/${key}. Configure AWS credentials to enable real uploads.`,
    );

    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }
}

