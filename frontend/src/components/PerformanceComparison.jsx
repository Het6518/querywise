import { BarChart3 } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ResultCard from './ResultCard.jsx';

export default function PerformanceComparison({ comparison = [], style }) {
  const rows = comparison.length
    ? comparison
    : [
        { metric: 'Cost', before: 0, after: 0 },
        { metric: 'Rows scanned', before: 0, after: 0 },
      ];

  return (
    <ResultCard title="Estimated Performance Comparison" icon={BarChart3} className="animate-cardIn" style={style} tone="amber">
      <p className="mb-5 border-l-[4px] border-l-app-amber bg-app-highlight p-3 font-sans text-sm leading-6 text-app-muted">
        AI-estimated values normalized to a 10,000-row table, not measured from a live database.
      </p>
      <div className="h-[280px] w-full">
        <ResponsiveContainer>
          <BarChart data={rows} margin={{ top: 12, right: 12, bottom: 4, left: 0 }}>
            <CartesianGrid stroke="#D8D2C8" vertical={false} />
            <XAxis dataKey="metric" stroke="#6B6258" tickLine={false} axisLine={false} />
            <YAxis stroke="#6B6258" tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: '#FFF3CD' }}
              contentStyle={{
                background: '#FFFFFF',
                border: '1px solid #D8D2C8',
                borderRadius: 0,
                color: '#1A1612',
              }}
            />
            <Legend />
            <Bar dataKey="before" name="Before optimization" fill="#D4502A" />
            <Bar dataKey="after" name="After optimization" fill="#2D7A4F" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-5 overflow-hidden border border-app-border">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-app-mutedBg text-app-text">
            <tr>
              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em]">Metric</th>
              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em]">Before</th>
              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em]">After</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-app-border text-app-muted">
            {rows.map((row) => (
              <tr key={row.metric} className="bg-app-surface">
                <td className="px-4 py-3">{row.metric}</td>
                <td className="px-4 py-3">{row.before}</td>
                <td className="px-4 py-3">{row.after}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ResultCard>
  );
}
