import {
  PrismaClient,
  UserRole,
  PlanType,
  BarbershopStatus,
  AppointmentStatus,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('ChangeMe123!', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'super@barberflow.app' },
    update: {},
    create: {
      email: 'super@barberflow.app',
      name: 'Super Admin',
      passwordHash: password,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  const barbershop = await prisma.barbershop.upsert({
    where: { slug: 'prime-barbers' },
    update: {},
    create: {
      name: 'Prime Barbers',
      slug: 'prime-barbers',
      plan: PlanType.PRO,
      status: BarbershopStatus.ACTIVE,
      phone: '+55 11 99999-9999',
      city: 'São Paulo',
      country: 'BR',
      config: {
        create: {
          acceptsOnlineBooking: true,
          autoApproveOnlineBooking: true,
          reminderHoursBefore: 2,
        },
      },
    },
    include: { config: true },
  });

  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@primebarbers.com' },
    update: {},
    create: {
      email: 'admin@primebarbers.com',
      name: 'Prime Admin',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      barbershopId: barbershop.id,
    },
  });

  const barberPassword = await bcrypt.hash('Barber123!', 10);
  const barber = await prisma.user.upsert({
    where: { email: 'barber@primebarbers.com' },
    update: {},
    create: {
      email: 'barber@primebarbers.com',
      name: 'Alex Barber',
      passwordHash: barberPassword,
      role: UserRole.BARBER,
      barbershopId: barbershop.id,
      barberProfile: {
        create: {
          barbershopId: barbershop.id,
          bio: 'Fade specialist',
          isPublic: true,
        },
      },
    },
    include: { barberProfile: true },
  });

  const receptionistPassword = await bcrypt.hash('Reception123!', 10);
  await prisma.user.upsert({
    where: { email: 'reception@primebarbers.com' },
    update: {},
    create: {
      email: 'reception@primebarbers.com',
      name: 'Maria Reception',
      passwordHash: receptionistPassword,
      role: UserRole.RECEPTIONIST,
      barbershopId: barbershop.id,
    },
  });

  const haircut = await prisma.service.upsert({
    where: { id: 'seed-haircut' },
    update: {},
    create: {
      id: 'seed-haircut',
      name: 'Classic Haircut',
      durationMinutes: 45,
      price: 80,
      barbershopId: barbershop.id,
    },
  });

  const beard = await prisma.service.upsert({
    where: { id: 'seed-beard' },
    update: {},
    create: {
      id: 'seed-beard',
      name: 'Beard Trim',
      durationMinutes: 30,
      price: 50,
      barbershopId: barbershop.id,
    },
  });

  const client = await prisma.client.upsert({
    where: { phone_barbershopId: { phone: '+55 11 98888-7777', barbershopId: barbershop.id } },
    update: {},
    create: {
      name: 'João Silva',
      phone: '+55 11 98888-7777',
      email: 'joao@example.com',
      barbershopId: barbershop.id,
    },
  });

  await prisma.appointment.upsert({
    where: { id: 'seed-appointment' },
    update: {},
    create: {
      id: 'seed-appointment',
      barbershopId: barbershop.id,
      clientId: client.id,
      barberId: barber.id,
      startTime: dayjs().add(1, 'day').set('hour', 10).toDate(),
      endTime: dayjs().add(1, 'day').set('hour', 11).toDate(),
      status: AppointmentStatus.SCHEDULED,
      services: {
        create: [
          {
            serviceId: haircut.id,
            priceAtTime: 80,
            durationMinutesAtTime: 45,
          },
        ],
      },
    },
  });

  console.log('Seed completed', {
    superAdmin: superAdmin.email,
    barbershop: barbershop.slug,
    admin: admin.email,
    barber: barber.email,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
