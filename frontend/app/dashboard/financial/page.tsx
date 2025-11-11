import { DashboardLayout } from '../../../components/layouts/dashboard-layout';

export default function FinancialPage() {
  return (
    <DashboardLayout title="Financial">
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900">Financial insights</h2>
        <p className="mt-2 text-sm text-slate-600">
          Monitor commissions, payment mix, and daily closures. Export reports and grant Accountant access.
        </p>
      </div>
    </DashboardLayout>
  );
}
