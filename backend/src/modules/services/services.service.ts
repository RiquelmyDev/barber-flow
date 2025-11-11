import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  list(barbershopId: string) {
    return this.prisma.service.findMany({
      where: { barbershopId },
      orderBy: { name: 'asc' },
    });
  }

  create(barbershopId: string, data: Prisma.ServiceCreateWithoutBarbershopInput) {
    return this.prisma.service.create({
      data: {
        ...data,
        barbershop: {
          connect: { id: barbershopId },
        },
      },
    });
  }

  update(id: string, barbershopId: string, data: Prisma.ServiceUpdateInput) {
    return this.prisma.service.update({
      where: { id_barbershopId: { id, barbershopId } },
      data,
    });
  }

  delete(id: string, barbershopId: string) {
    return this.prisma.service.delete({
      where: { id_barbershopId: { id, barbershopId } },
    });
  }
}
