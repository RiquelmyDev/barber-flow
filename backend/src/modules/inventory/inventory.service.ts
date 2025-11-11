import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  listProducts(barbershopId: string) {
    return this.prisma.product.findMany({
      where: { barbershopId },
      orderBy: { name: 'asc' },
    });
  }

  createProduct(barbershopId: string, data: Prisma.ProductCreateWithoutBarbershopInput) {
    return this.prisma.product.create({
      data: {
        ...data,
        barbershop: { connect: { id: barbershopId } },
      },
    });
  }

  recordMovement(barbershopId: string, userId: string, data: Omit<Prisma.InventoryMovementCreateInput, 'barbershop' | 'createdBy'>) {
    return this.prisma.inventoryMovement.create({
      data: {
        ...data,
        barbershop: { connect: { id: barbershopId } },
        createdBy: { connect: { id: userId } },
      },
    });
  }

  movements(barbershopId: string) {
    return this.prisma.inventoryMovement.findMany({
      where: { barbershopId },
      orderBy: { createdAt: 'desc' },
      include: { product: true },
    });
  }
}
