import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';

import { CurrentUserDecorator } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { TenantGuard } from '../../guards/tenant.guard';
import { ConfigurationsService } from './configurations.service';

@Controller('me/barbershop-config')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@Roles(UserRole.ADMIN)
export class ConfigurationsController {
  constructor(private readonly configurationService: ConfigurationsService) {}

  @Get()
  getConfig(@CurrentUserDecorator() user: any) {
    return this.configurationService.getConfig(user.barbershopId);
  }

  @Put()
  updateConfig(@CurrentUserDecorator() user: any, @Body() body: any) {
    return this.configurationService.upsertConfig(user.barbershopId, body);
  }
}
