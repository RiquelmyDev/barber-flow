import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('barbershops')
  findAll() {
    return this.adminService.listBarbershops();
  }

  @Post('barbershops')
  create(@Body() body: any) {
    return this.adminService.createBarbershop(body);
  }

  @Patch('barbershops/:id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateBarbershop(id, body);
  }

  @Post('barbershops/:id/reset-admin-password')
  async resetPassword(@Param('id') id: string, @Body('password') password: string) {
    const hash = await bcrypt.hash(password, 10);
    return this.adminService.resetAdminPassword(id, hash);
  }

  @Get('stats')
  stats() {
    return this.adminService.globalStats();
  }
}
