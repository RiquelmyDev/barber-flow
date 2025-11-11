import { notFound } from 'next/navigation';
import Image from 'next/image';

import { PublicBookingForm } from '../../../components/ui/public-booking-form';

async function fetchBarbershop(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'}/public/${slug}/services`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

interface PublicBookingPageProps {
  params: { slug: string };
}

export default async function PublicBookingPage({ params }: PublicBookingPageProps) {
  const barbershop = await fetchBarbershop(params.slug);
  if (!barbershop) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={barbershop.logoUrl ?? 'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c'}
          alt={barbershop.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-x-0 bottom-0 px-6 py-8 text-white">
          <h1 className="text-3xl font-semibold">{barbershop.name}</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/80">
            Book your next experience with our curated team of artists. Online booking is always open.
          </p>
        </div>
      </div>
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12 md:flex-row">
        <aside className="md:w-1/3">
          <h2 className="text-lg font-semibold text-slate-900">Services</h2>
          <p className="mt-2 text-sm text-slate-600">
            Select one or more services to reveal available times. All prices are shown in local currency.
          </p>
          <div className="mt-4 space-y-3">
            {barbershop.services.map((service: any) => (
              <div key={service.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">{service.name}</p>
                <p className="text-xs text-slate-500">{service.durationMinutes} min · R$ {service.price}</p>
                <p className="mt-2 text-xs text-slate-500">{service.description ?? 'Premium experience guaranteed.'}</p>
              </div>
            ))}
          </div>
          {barbershop.barbers?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-slate-900">Our Artists</h3>
              <ul className="mt-3 space-y-3">
                {barbershop.barbers.map((barber: any) => (
                  <li key={barber.id} className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-full bg-primary/10" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{barber.user.name}</p>
                      <p className="text-xs text-slate-500">{barber.bio ?? 'Master barber'}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
        <div className="md:w-2/3">
          <PublicBookingForm barbershop={barbershop} />
        </div>
      </div>
    </div>
  );
}
