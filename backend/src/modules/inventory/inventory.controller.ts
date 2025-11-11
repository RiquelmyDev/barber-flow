import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { CurrentUserDecorator } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { TenantGuard } from '../../guards/tenant.guard';
import { InventoryService } from './inventory.service';

@Controller('me/inventory')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('products')
  products(@CurrentUserDecorator() user: any) {
    return this.inventoryService.listProducts(user.barbershopId);
  }

  @Post('products')
  createProduct(@CurrentUserDecorator() user: any, @Body() body: any) {
    return this.inventoryService.createProduct(user.barbershopId, body);
  }

  @Post('movements')
  movement(@CurrentUserDecorator() user: any, @Body() body: any) {
    return this.inventoryService.recordMovement(user.barbershopId, user.id, body);
  }

  @Get('movements')
  movements(@CurrentUserDecorator() user: any) {
    return this.inventoryService.movements(user.barbershopId);
  }
}
