import { Injectable } from '@nestjs/common';
import { AppointmentStatus, Prisma } from '@prisma/client';
import dayjs from 'dayjs';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  list(barbershopId: string, filters: any) {
    return this.prisma.appointment.findMany({
      where: {
        barbershopId,
        barberId: filters.barberId,
        status: filters.status,
        startTime: filters.from
          ? { gte: filters.from, lte: filters.to ?? dayjs(filters.from).endOf('day').toDate() }
          : undefined,
      },
      include: {
        client: true,
        services: { include: { service: true } },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  create(barbershopId: string, data: Prisma.AppointmentCreateInput) {
    return this.prisma.appointment.create({
      data: {
        ...data,
        barbershop: { connect: { id: barbershopId } },
      },
      include: { services: true },
    });
  }

  update(barbershopId: string, id: string, data: Prisma.AppointmentUpdateInput) {
    return this.prisma.appointment.update({
      where: { id_barbershopId: { id, barbershopId } },
      data,
      include: { services: true },
    });
  }

  changeStatus(barbershopId: string, id: string, status: AppointmentStatus) {
    return this.prisma.appointment.update({
      where: { id_barbershopId: { id, barbershopId } },
      data: { status },
    });
  }
}
