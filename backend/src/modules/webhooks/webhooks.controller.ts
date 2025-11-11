import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { CurrentUserDecorator } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { TenantGuard } from '../../guards/tenant.guard';
import { WebhooksService } from './webhooks.service';

@Controller('me/webhooks')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@Roles(UserRole.ADMIN)
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Get()
  list(@CurrentUserDecorator() user: any) {
    return this.webhooksService.listConfigs(user.barbershopId);
  }

  @Post()
  upsert(@CurrentUserDecorator() user: any, @Body() body: any) {
    return this.webhooksService.upsertConfig(user.barbershopId, body);
  }
}
