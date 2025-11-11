import { Module } from '@nestjs/common';

import { QueueModule } from '../../queue/queue.module';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';

@Module({
  imports: [QueueModule],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
