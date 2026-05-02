"use client";

import { useState, useMemo } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { chartColors } from "@/lib/chart-colors";

/**
 * Interactive Competitive Rate Comparison — matches app behavior.
 * Prices in cents; occupancy 0–100.
 */
const FULL_MOCK_DATA = [
  { dateLabel: "Mar 18", "Your Hotel": 11200, "Comp Avg": 10800, Recommended: 11500, Occupancy: 72 },
  { dateLabel: "Mar 19", "Your Hotel": 11600, "Comp Avg": 11000, Recommended: 11800, Occupancy: 68 },
  { dateLabel: "Mar 20", "Your Hotel": 12000, "Comp Avg": 11400, Recommended: 12200, Occupancy: 75 },
  { dateLabel: "Mar 21", "Your Hotel": 12400, "Comp Avg": 11800, Recommended: 12600, Occupancy: 78 },
  { dateLabel: "Mar 22", "Your Hotel": 12800, "Comp Avg": 12000, Recommended: 13000, Occupancy: 82 },
  { dateLabel: "Mar 23", "Your Hotel": 13200, "Comp Avg": 12400, Recommended: 13400, Occupancy: 85 },
  { dateLabel: "Mar 24", "Your Hotel": 13000, "Comp Avg": 12200, Recommended: 13200, Occupancy: 80 },
  { dateLabel: "Mar 25", "Your Hotel": 12600, "Comp Avg": 12000, Recommended: 12800, Occupancy: 76 },
  { dateLabel: "Mar 26", "Your Hotel": 12400, "Comp Avg": 11800, Recommended: 12600, Occupancy: 74 },
  { dateLabel: "Mar 27", "Your Hotel": 12200, "Comp Avg": 11600, Recommended: 12400, Occupancy: 70 },
  { dateLabel: "Mar 28", "Your Hotel": 12000, "Comp Avg": 11500, Recommended: 12200, Occupancy: 72 },
  { dateLabel: "Mar 29", "Your Hotel": 11800, "Comp Avg": 11400, Recommended: 12000, Occupancy: 68 },
  { dateLabel: "Mar 30", "Your Hotel": 11600, "Comp Avg": 11200, Recommended: 11800, Occupancy: 65 },
  { dateLabel: "Mar 31", "Your Hotel": 11400, "Comp Avg": 11000, Recommended: 11600, Occupancy: 62 },
];

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length || !label) return null;
  return (
    <div className="rounded-lg border bg-popover p-3 shadow-lg text-xs min-w-[160px] text-popover-foreground">
      <p className="font-semibold mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-3 py-0.5">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}</span>
          </div>
          <span className="font-medium">
            {entry.name === "Occupancy" ? `${Math.round(entry.value)}%` : `$${Math.round(entry.value / 100)}`}
          </span>
        </div>
      ))}
    </div>
  );
}

const RANGES = [7, 14, 30] as const;

export function HeroChart() {
  const [graphRange, setGraphRange] = useState<7 | 14 | 30>(14);

  const chartData = useMemo(
    () => FULL_MOCK_DATA.slice(-graphRange),
    [graphRange]
  );

  const barSize = graphRange > 14 ? 8 : 14;

  return (
    <div className="rounded-xl border bg-card p-3 shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Competitive Rate Comparison</h3>
        <div className="flex rounded-md border bg-muted p-0.5" role="tablist" aria-label="Date range">
          {RANGES.map((days) => (
            <button
              key={days}
              type="button"
              role="tab"
              aria-selected={graphRange === days}
              onClick={() => setGraphRange(days)}
              className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                graphRange === days
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis dataKey="dateLabel" tick={{ fontSize: 10, fill: chartColors.axis }} tickLine={false} />
            <YAxis
              yAxisId="price"
              tick={{ fontSize: 10, fill: chartColors.axis }}
              tickLine={false}
              tickFormatter={(v) => `$${Math.round(v / 100)}`}
              width={42}
            />
            <YAxis
              yAxisId="occ"
              orientation="right"
              tick={{ fontSize: 10, fill: chartColors.axis }}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
              width={32}
              domain={[0, 100]}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 10 }} iconSize={6} />
            <Bar
              yAxisId="occ"
              dataKey="Occupancy"
              fill={chartColors.occupancy}
              opacity={0.5}
              radius={[2, 2, 0, 0]}
              barSize={barSize}
              name="Occupancy"
            />
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="Your Hotel"
              stroke={chartColors.primary}
              strokeWidth={2}
              dot={{ r: 2.5, fill: chartColors.primary }}
              connectNulls
              name="Your Hotel"
            />
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="Comp Avg"
              stroke={chartColors.comparison}
              strokeWidth={1.25}
              strokeDasharray="4 4"
              dot={false}
              connectNulls
              name="Comp Avg"
            />
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="Recommended"
              stroke={chartColors.recommended}
              strokeWidth={1.5}
              strokeDasharray="6 3"
              dot={false}
              connectNulls
              name="AI Recommended"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-1 text-center text-[10px] text-muted-foreground">
        Same chart as in the dashboard · Switch range to see 7, 14, or 30 days
      </p>
    </div>
  );
}
