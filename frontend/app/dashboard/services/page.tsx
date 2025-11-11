import { DashboardLayout } from '../../../components/layouts/dashboard-layout';

export default function ServicesPage() {
  return (
    <DashboardLayout title="Services">
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900">Service catalog</h2>
        <p className="mt-2 text-sm text-slate-600">
          Manage durations, pricing, and commissions per service. Changes sync instantly to public booking.
        </p>
      </div>
    </DashboardLayout>
  );
}
