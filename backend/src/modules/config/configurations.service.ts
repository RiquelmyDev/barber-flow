import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ConfigurationsService {
  constructor(private readonly prisma: PrismaService) {}

  getConfig(barbershopId: string) {
    return this.prisma.barbershopConfig.findUnique({
      where: { barbershopId },
    });
  }

  upsertConfig(barbershopId: string, data: any) {
    return this.prisma.barbershopConfig.upsert({
      where: { barbershopId },
      update: data,
      create: {
        barbershopId,
        ...data,
      },
    });
  }
}
