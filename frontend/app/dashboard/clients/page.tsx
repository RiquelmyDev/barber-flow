import { DashboardLayout } from '../../../components/layouts/dashboard-layout';

export default function ClientsPage() {
  return (
    <DashboardLayout title="Clients">
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900">Client intelligence</h2>
        <p className="mt-2 text-sm text-slate-600">
          Search, segment, and engage VIP clients. Connect with WhatsApp templates and loyalty profiles.
        </p>
      </div>
    </DashboardLayout>
  );
}
