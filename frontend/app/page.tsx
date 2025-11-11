import Link from 'next/link';

import { PrimaryButton } from '../components/ui/primary-button';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-12 px-6 text-center">
      <div className="space-y-4">
        <span className="rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
          BarberFlow
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          The modern operating system for multi-tenant barbershops.
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Manage schedules, finances, customer relationships, and communications from a single,
          beautiful platform inspired by the best Apple experiences.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <PrimaryButton href="/login">Sign in</PrimaryButton>
        <Link href="/public-booking/prime-barbers" className="text-primary hover:underline">
          Preview public booking
        </Link>
      </div>
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
        {["Tenant isolation", "Omnichannel notifications", "Financial intelligence"].map((feature) => (
          <div key={feature} className="card text-left">
            <h3 className="text-lg font-semibold text-slate-900">{feature}</h3>
            <p className="mt-2 text-sm text-slate-600">
              Designed for modern barbershops with enterprise-grade security, RBAC, and proactive
              automation to delight teams and clients.
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
