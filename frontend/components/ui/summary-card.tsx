interface SummaryCardProps {
  label: string;
  value: string;
  trend: string;
}

export function SummaryCard({ label, value, trend }: SummaryCardProps) {
  return (
    <div className="card">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-primary">{trend}</p>
    </div>
  );
}
