import { DashboardLayout } from '../../../components/layouts/dashboard-layout';

export default function WebhooksPage() {
  return (
    <DashboardLayout title="Webhooks">
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900">Webhook delivery</h2>
        <p className="mt-2 text-sm text-slate-600">
          Configure signed events for Pro tenants. Track delivery attempts, retries, and payload history.
        </p>
      </div>
    </DashboardLayout>
  );
}
