import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';

@Injectable()
export class StorageService {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.client = new S3Client({
      region: this.configService.get<string>('aws.region'),
      credentials: {
        accessKeyId: this.configService.get<string>('aws.accessKeyId') ?? '',
        secretAccessKey: this.configService.get<string>('aws.secretAccessKey') ?? '',
      },
    });
    this.bucket = this.configService.get<string>('aws.bucket') ?? '';
  }

  async uploadBase64Image(base64: string, prefix = 'uploads') {
    if (!this.bucket) {
      throw new Error('S3 bucket not configured');
    }
    const buffer = Buffer.from(base64, 'base64');
    const key = `${prefix}/${nanoid()}.png`;
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: 'image/png',
        ACL: 'public-read',
      }),
    );
    return `https://${this.bucket}.s3.${this.configService.get<string>('aws.region')}.amazonaws.com/${key}`;
  }
}
