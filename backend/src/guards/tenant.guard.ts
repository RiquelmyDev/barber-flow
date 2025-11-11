import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { TenantScopedRoles } from '../common/enums/role.enum';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const barbershopId = request.params.barbershopId || request.body?.barbershopId;

    if (!user) {
      return false;
    }

    if (!TenantScopedRoles.includes(user.role)) {
      return true;
    }

    if (!user.barbershopId) {
      return false;
    }

    if (!barbershopId) {
      // Fallback to request-scoped barbershop on request
      request.barbershopId = user.barbershopId;
      return true;
    }

    return barbershopId === user.barbershopId;
  }
}
