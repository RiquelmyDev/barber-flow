import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { CurrentUserDecorator } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { TenantGuard } from '../../guards/tenant.guard';
import { FinancialService } from './financial.service';

@Controller('me/financial')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@Roles(UserRole.ADMIN, UserRole.ACCOUNTANT)
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @Get('summary')
  summary(@CurrentUserDecorator() user: any, @Query('from') from?: string, @Query('to') to?: string) {
    return this.financialService.summary(
      user.barbershopId,
      from ? new Date(from) : undefined,
      to ? new Date(to) : undefined,
    );
  }

  @Get('commissions')
  commissions(
    @CurrentUserDecorator() user: any,
    @Query('barberId') barberId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.financialService.commissions(
      user.barbershopId,
      barberId,
      from ? new Date(from) : undefined,
      to ? new Date(to) : undefined,
    );
  }

  @Post('daily-closure')
  createDailyClosure(@CurrentUserDecorator() user: any, @Body() body: any) {
    return this.financialService.createDailyClosure(user.barbershopId, body);
  }

  @Get('daily-closures')
  listDailyClosures(@CurrentUserDecorator() user: any) {
    return this.financialService.listDailyClosures(user.barbershopId);
  }
}
