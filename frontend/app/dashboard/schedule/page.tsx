import { DashboardLayout } from '../../../components/layouts/dashboard-layout';

export default function SchedulePage() {
  return (
    <DashboardLayout title="Schedule">
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900">Smart calendar</h2>
        <p className="mt-2 text-sm text-slate-600">
          Integrate availability, auto-approvals, and manual bookings. This placeholder highlights where the
          calendar component will live.
        </p>
      </div>
    </DashboardLayout>
  );
}
