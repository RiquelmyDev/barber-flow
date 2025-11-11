import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { QueueModule } from './queue/queue.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './modules/admin/admin.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ConfigurationsModule } from './modules/config/configurations.module';
import { FinancialModule } from './modules/financial/financial.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PublicModule } from './modules/public/public.module';
import { ServicesModule } from './modules/services/services.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import configuration from './common/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    QueueModule,
    UsersModule,
    AuthModule,
    AdminModule,
    ConfigurationsModule,
    ServicesModule,
    AppointmentsModule,
    ClientsModule,
    FinancialModule,
    InventoryModule,
    NotificationsModule,
    PublicModule,
    WebhooksModule,
  ],
})
export class AppModule {}
