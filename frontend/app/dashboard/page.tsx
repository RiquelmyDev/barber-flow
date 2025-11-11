import { DashboardLayout } from '../../components/layouts/dashboard-layout';
import { SummaryCard } from '../../components/ui/summary-card';

const metrics = [
  { label: 'Today\'s appointments', value: '18', trend: '+12% vs. yesterday' },
  { label: 'Monthly revenue', value: 'R$ 42.300', trend: '+8% vs. last month' },
  { label: 'Active barbers', value: '7', trend: 'All shifts covered' },
];

export default function DashboardPage() {
  return (
    <DashboardLayout title="Overview">
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {metrics.map((metric) => (
          <SummaryCard key={metric.label} {...metric} />
        ))}
      </section>
      <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900">Upcoming bookings</h2>
          <p className="mt-2 text-sm text-slate-600">
            Quickly review the next arrivals and make sure each client receives a premium welcome.
          </p>
          <ul className="mt-4 space-y-3">
            {[1, 2, 3].map((item) => (
              <li
                key={item}
                className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">Alex Johnson</p>
                  <p className="text-xs text-slate-500">Haircut • 14:30 • Barber: Maria</p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Confirmed
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900">Performance spotlight</h2>
          <p className="mt-2 text-sm text-slate-600">Top services and barbers in the last 30 days.</p>
          <div className="mt-4 space-y-4">
            {["Classic Haircut", "Premium Beard", "Royal Treatment"].map((service) => (
              <div key={service} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">{service}</p>
                  <p className="text-xs text-slate-500">Avg rating 4.9 · 120 bookings</p>
                </div>
                <span className="text-sm font-semibold text-primary">R$ 12.480</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
