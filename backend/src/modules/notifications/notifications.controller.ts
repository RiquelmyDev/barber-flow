import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { CurrentUserDecorator } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { TenantGuard } from '../../guards/tenant.guard';
import { NotificationsService } from './notifications.service';

@Controller('me/notifications')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@Roles(UserRole.ADMIN)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('test-email')
  testEmail(@CurrentUserDecorator() user: any, @Body('to') to: string) {
    return this.notificationsService.sendTestEmail(user.barbershopId, to);
  }

  @Post('test-whatsapp')
  testWhatsapp(@CurrentUserDecorator() user: any, @Body('to') to: string) {
    return this.notificationsService.sendTestWhatsapp(user.barbershopId, to);
  }

  @Get('logs')
  logs(
    @CurrentUserDecorator() user: any,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
  ) {
    return this.notificationsService.listLogs(
      user.barbershopId,
      Number(page),
      Number(pageSize),
    );
  }
}
