import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  list(barbershopId: string, query?: string) {
    return this.prisma.client.findMany({
      where: {
        barbershopId,
        name: query ? { contains: query, mode: 'insensitive' } : undefined,
      },
      orderBy: { name: 'asc' },
    });
  }

  create(barbershopId: string, data: Prisma.ClientCreateWithoutBarbershopInput) {
    return this.prisma.client.create({
      data: {
        ...data,
        barbershop: { connect: { id: barbershopId } },
      },
    });
  }

  update(barbershopId: string, id: string, data: Prisma.ClientUpdateInput) {
    return this.prisma.client.update({
      where: { id_barbershopId: { id, barbershopId } },
      data,
    });
  }

  findHistory(barbershopId: string, id: string) {
    return this.prisma.client.findUnique({
      where: { id_barbershopId: { id, barbershopId } },
      include: {
        appointments: {
          include: {
            services: { include: { service: true } },
            payments: true,
          },
        },
      },
    });
  }
}
