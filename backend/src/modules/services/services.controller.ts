import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';

import { CurrentUserDecorator } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { TenantGuard } from '../../guards/tenant.guard';
import { ServicesService } from './services.service';

@Controller('me/services')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  findAll(@CurrentUserDecorator() user: any) {
    return this.servicesService.list(user.barbershopId);
  }

  @Post()
  create(@CurrentUserDecorator() user: any, @Body() body: any) {
    return this.servicesService.create(user.barbershopId, body);
  }

  @Put(':id')
  update(@CurrentUserDecorator() user: any, @Param('id') id: string, @Body() body: any) {
    return this.servicesService.update(id, user.barbershopId, body);
  }

  @Delete(':id')
  remove(@CurrentUserDecorator() user: any, @Param('id') id: string) {
    return this.servicesService.delete(id, user.barbershopId);
  }
}
