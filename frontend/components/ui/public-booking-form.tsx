'use client';

import dayjs from 'dayjs';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

import { PrimaryButton } from './primary-button';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface PublicBookingFormProps {
  barbershop: any;
}

export function PublicBookingForm({ barbershop }: PublicBookingFormProps) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? '/api';
  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      services: [] as string[],
      barberId: '',
      date: dayjs().format('YYYY-MM-DD'),
      time: '',
      name: '',
      phone: '',
      email: '',
    },
  });
  const [status, setStatus] = useState<string | null>(null);

  const date = watch('date');
  const { data: availability } = useSWR(
    `${apiBase}/public/${barbershop.slug}/availability?date=${date}`,
    fetcher,
  );

  const onSubmit = async (values: any) => {
    setStatus('pending');
    const startTime = dayjs(`${values.date} ${values.time}`).toISOString();
    const totalDuration = values.services
      .map((id: string) => barbershop.services.find((service: any) => service.id === id)?.durationMinutes ?? 30)
      .reduce((acc: number, duration: number) => acc + duration, 0);
    const endTime = dayjs(startTime).add(totalDuration, 'minute').toISOString();

    const response = await fetch(`${apiBase}/public/${barbershop.slug}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...values,
        startTime,
        endTime,
      }),
    });

    if (response.ok) {
      setStatus('success');
      reset();
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-slate-900">Book an appointment</h2>
      <p className="mt-2 text-sm text-slate-600">Complete the form and we\'ll confirm your reservation instantly.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Services</label>
            <div className="mt-2 space-y-2">
              {barbershop.services.map((service: any) => (
                <label key={service.id} className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" value={service.id} {...register('services')} className="rounded border-slate-300" />
                  <span>
                    {service.name} · {service.durationMinutes} min · R$ {service.price}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Choose a barber</label>
              <select
                {...register('barberId')}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              >
                <option value="">Any available</option>
                {barbershop.barbers?.map((barber: any) => (
                  <option key={barber.id} value={barber.user.id}>
                    {barber.user.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Date</label>
                <input
                  type="date"
                  {...register('date')}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Time</label>
                <select {...register('time')} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm">
                  <option value="">Select</option>
                  {availability?.appointments
                    ?.filter((slot: any) => slot.status !== 'SCHEDULED')
                    .map((slot: any) => (
                      <option key={slot.id} value={dayjs(slot.startTime).format('HH:mm')}>
                        {dayjs(slot.startTime).format('HH:mm')}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Full name</label>
            <input
              type="text"
              {...register('name')}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</label>
            <input
              type="tel"
              {...register('phone')}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              placeholder="(+55)"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</label>
            <input
              type="email"
              {...register('email')}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <PrimaryButton type="submit" className="w-full">
          Confirm booking
        </PrimaryButton>
        {status === 'success' && (
          <p className="text-sm font-medium text-green-600">Appointment reserved! You\'ll receive a confirmation soon.</p>
        )}
        {status === 'error' && (
          <p className="text-sm font-medium text-red-500">Unable to book. Please try another time slot.</p>
        )}
      </form>
    </div>
  );
}
