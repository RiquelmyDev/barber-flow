'use client';

import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { ReactNode, useState } from 'react';

import { ThemeToggle } from '../ui/theme-toggle';

interface DashboardLayoutProps {
  title: string;
  children: ReactNode;
}

const navItems = [
  { name: 'Overview', href: '/dashboard' },
  { name: 'Schedule', href: '/dashboard/schedule' },
  { name: 'Clients', href: '/dashboard/clients' },
  { name: 'Financial', href: '/dashboard/financial' },
  { name: 'Services', href: '/dashboard/services' },
  { name: 'Webhooks', href: '/dashboard/webhooks' },
];

export function DashboardLayout({ title, children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside
        className={`fixed inset-y-0 z-20 w-64 transform bg-white p-6 shadow-xl transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-slate-900">BarberFlow</span>
          <button
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="mt-10 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-primary/10 hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              className="rounded-xl border border-slate-200 p-2 text-slate-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Today</p>
              <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:text-primary">
              <BellIcon className="h-5 w-5" />
            </button>
            <ThemeToggle />
            <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-white">
              <span className="h-8 w-8 rounded-full bg-primary-light" />
              <div>
                <p className="text-sm font-medium">Alex Barber</p>
                <p className="text-xs text-slate-200">Administrator</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
