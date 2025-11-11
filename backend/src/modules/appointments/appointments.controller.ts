import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CurrentUserDecorator } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { TenantGuard } from '../../guards/tenant.guard';
import { AppointmentsService } from './appointments.service';

@Controller('me/appointments')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@Roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.BARBER)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  list(@CurrentUserDecorator() user: any, @Query() query: any) {
    const filters = {
      barberId: query.barberId ?? (user.role === UserRole.BARBER ? user.id : undefined),
      status: query.status,
      from: query.from ? new Date(query.from) : undefined,
      to: query.to ? new Date(query.to) : undefined,
    };
    return this.appointmentsService.list(user.barbershopId, filters);
  }

  @Post()
  create(@CurrentUserDecorator() user: any, @Body() body: any) {
    return this.appointmentsService.create(user.barbershopId, body);
  }

  @Patch(':id')
  update(@CurrentUserDecorator() user: any, @Param('id') id: string, @Body() body: any) {
    return this.appointmentsService.update(user.barbershopId, id, body);
  }

  @Post(':id/:action')
  changeStatus(
    @CurrentUserDecorator() user: any,
    @Param('id') id: string,
    @Param('action') action: string,
  ) {
    const mapping: Record<string, string> = {
      start: 'IN_PROGRESS',
      complete: 'COMPLETED',
      cancel: 'CANCELED',
      'no-show': 'NO_SHOW',
    };
    return this.appointmentsService.changeStatus(
      user.barbershopId,
      id,
      mapping[action] as any,
    );
  }
}
