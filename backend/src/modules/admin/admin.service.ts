import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, BarbershopStatus, PlanType } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '../../common/enums/role.enum';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  listBarbershops() {
    return this.prisma.barbershop.findMany({
      include: {
        users: {
          where: { role: UserRole.ADMIN },
          select: { id: true, email: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createBarbershop(data: Prisma.BarbershopCreateInput) {
    return this.prisma.barbershop.create({ data });
  }

  async updateBarbershop(id: string, data: Prisma.BarbershopUpdateInput) {
    const barbershop = await this.prisma.barbershop.update({ where: { id }, data });
    return barbershop;
  }

  async resetAdminPassword(barbershopId: string, passwordHash: string) {
    const admin = await this.prisma.user.findFirst({
      where: { barbershopId, role: UserRole.ADMIN },
    });
    if (!admin) {
      throw new NotFoundException('Barbershop admin not found');
    }
    return this.prisma.user.update({
      where: { id: admin.id },
      data: { passwordHash },
    });
  }

  async globalStats() {
    const [barbershopCount, userCount, appointmentsCount, revenue] = await Promise.all([
      this.prisma.barbershop.count(),
      this.prisma.user.count(),
      this.prisma.appointment.count(),
      this.prisma.payment.aggregate({ _sum: { amountFinal: true } }),
    ]);

    return {
      barbershopCount,
      userCount,
      appointmentsCount,
      revenue: revenue._sum.amountFinal ?? 0,
    };
  }

  updatePlan(id: string, plan: PlanType, status: BarbershopStatus) {
    return this.prisma.barbershop.update({
      where: { id },
      data: { plan, status },
    });
  }
}
