import { Injectable, NotFoundException } from '@nestjs/common';
import dayjs from 'dayjs';

import { PrismaService } from '../../prisma/prisma.service';
import { QueueService } from '../../queue/queue.service';

@Injectable()
export class PublicService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queueService: QueueService,
  ) {}

  async barbershopBySlug(slug: string) {
    const barbershop = await this.prisma.barbershop.findUnique({
      where: { slug },
      include: {
        config: true,
        services: { where: { isActive: true } },
        barbers: {
          where: { isPublic: true },
          include: {
            user: { select: { id: true, name: true } },
          },
        },
      },
    });
    if (!barbershop) throw new NotFoundException('Barbershop not found');
    return barbershop;
  }

  async availability(slug: string, date: string) {
    const barbershop = await this.barbershopBySlug(slug);
    const start = dayjs(date).startOf('day').toDate();
    const end = dayjs(date).endOf('day').toDate();
    const appointments = await this.prisma.appointment.findMany({
      where: { barbershopId: barbershop.id, startTime: { gte: start, lte: end } },
    });
    return { date, appointments };
  }

  async createBooking(slug: string, payload: any) {
    const barbershop = await this.barbershopBySlug(slug);
    const client = await this.prisma.client.upsert({
      where: {
        phone_barbershopId: {
          phone: payload.phone,
          barbershopId: barbershop.id,
        },
      },
      create: {
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        barbershop: { connect: { id: barbershop.id } },
      },
      update: {
        name: payload.name,
        email: payload.email,
      },
    });

    const appointment = await this.prisma.appointment.create({
      data: {
        barbershop: { connect: { id: barbershop.id } },
        client: { connect: { id: client.id } },
        startTime: new Date(payload.startTime),
        endTime: new Date(payload.endTime),
        barber: payload.barberId ? { connect: { id: payload.barberId } } : undefined,
        status: barbershop.config?.autoApproveOnlineBooking ? 'SCHEDULED' : 'PENDING',
        services: {
          create: payload.services.map((serviceId: string) => ({
            service: { connect: { id: serviceId } },
            priceAtTime: payload.prices?.[serviceId] ?? 0,
            durationMinutesAtTime: payload.durations?.[serviceId] ?? 30,
          })),
        },
      },
      include: { services: true },
    });

    await this.queueService.enqueueNotification(
      {
        type: 'booking.created',
        barbershopId: barbershop.id,
        appointmentId: appointment.id,
        clientId: client.id,
      },
      Math.max((barbershop.config?.reminderHoursBefore ?? 2) * 60 * 60 * 1000, 0),
    );

    return appointment;
  }
}
