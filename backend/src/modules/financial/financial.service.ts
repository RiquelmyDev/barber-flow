import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FinancialService {
  constructor(private readonly prisma: PrismaService) {}

  async summary(barbershopId: string, from?: Date, to?: Date) {
    const filters = {
      barbershopId,
      paidAt: {
        gte: from,
        lte: to ?? (from ? dayjs(from).endOf('day').toDate() : undefined),
      },
    };
    const payments = await this.prisma.payment.aggregate({
      where: filters,
      _sum: {
        amountFinal: true,
      },
    });

    const byMethod = await this.prisma.payment.groupBy({
      where: filters,
      by: ['paymentMethod'],
      _sum: { amountFinal: true },
    });

    return {
      total: payments._sum.amountFinal ?? 0,
      byMethod,
    };
  }

  commissions(barbershopId: string, barberId?: string, from?: Date, to?: Date) {
    return this.prisma.commissionRecord.findMany({
      where: {
        barbershopId,
        barberId,
        calculatedAt: {
          gte: from,
          lte: to ?? (from ? dayjs(from).endOf('day').toDate() : undefined),
        },
      },
      orderBy: { calculatedAt: 'desc' },
    });
  }

  createDailyClosure(barbershopId: string, data: any) {
    return this.prisma.dailyClosure.create({
      data: {
        ...data,
        barbershop: { connect: { id: barbershopId } },
      },
    });
  }

  listDailyClosures(barbershopId: string) {
    return this.prisma.dailyClosure.findMany({
      where: { barbershopId },
      orderBy: { date: 'desc' },
    });
  }
}
