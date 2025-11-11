import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';

import { CurrentUserDecorator } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { TenantGuard } from '../../guards/tenant.guard';
import { ClientsService } from './clients.service';

@Controller('me/clients')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  list(@CurrentUserDecorator() user: any, @Query('q') q?: string) {
    return this.clientsService.list(user.barbershopId, q);
  }

  @Post()
  create(@CurrentUserDecorator() user: any, @Body() body: any) {
    return this.clientsService.create(user.barbershopId, body);
  }

  @Put(':id')
  update(@CurrentUserDecorator() user: any, @Param('id') id: string, @Body() body: any) {
    return this.clientsService.update(user.barbershopId, id, body);
  }

  @Get(':id/history')
  history(@CurrentUserDecorator() user: any, @Param('id') id: string) {
    return this.clientsService.findHistory(user.barbershopId, id);
  }
}
