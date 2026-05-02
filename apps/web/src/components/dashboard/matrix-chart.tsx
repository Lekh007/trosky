"use client";

import { useMemo } from "react";
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
  ReferenceDot,
} from "recharts";
import { chartColors } from "@/lib/chart-colors";
import type { DashboardDay } from "@hotel-pricing/shared";

interface MatrixChartProps {
  days: DashboardDay[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00Z");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function MatrixChart({ days }: MatrixChartProps) {
  const chartData = useMemo(
    () =>
      days.map((d) => ({
        date: formatDate(d.date),
        fullDate: d.date,
        ourRate: d.ourRate ? d.ourRate / 100 : null,
        compAvg: d.compAvgRate ? d.compAvgRate / 100 : null,
        recommended: d.recommendedRate ? d.recommendedRate / 100 : null,
        occupancy: d.occPercent,
        hasEvent: d.hasEvent,
      })),
    [days]
  );

  const eventDots = chartData
    .filter((d) => d.hasEvent && d.ourRate)
    .map((d) => ({ x: d.date, y: d.ourRate! }));

  return (
    <div className="border rounded-lg p-4 bg-card">
      <h3 className="text-sm font-medium mb-4">Rate Comparison & Occupancy</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: chartColors.axis }}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11, fill: chartColors.axis }}
            tickFormatter={(v) => `$${v}`}
            domain={["auto", "auto"]}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 11, fill: chartColors.axis }}
            tickFormatter={(v) => `${v}%`}
            domain={[0, 100]}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const data = payload[0]?.payload;
              return (
                <div className="bg-popover text-popover-foreground border rounded-lg shadow-lg p-3 text-xs space-y-1">
                  <p className="font-semibold">{label}</p>
                  {data?.ourRate && (
                    <p className="text-blue-600">
                      Our Rate: <span className="font-medium">${data.ourRate}</span>
                    </p>
                  )}
                  {data?.compAvg && (
                    <p className="text-muted-foreground">
                      Comp Avg: <span className="font-medium">${Math.round(data.compAvg)}</span>
                    </p>
                  )}
                  {data?.recommended && (
                    <p className="text-emerald-600">
                      Recommended: <span className="font-medium">${Math.round(data.recommended)}</span>
                    </p>
                  )}
                  {data?.occupancy !== null && data?.occupancy !== undefined && (
                    <p className="text-purple-600">
                      Occupancy: <span className="font-medium">{data.occupancy.toFixed(1)}%</span>
                    </p>
                  )}
                  {data?.hasEvent && (
                    <p className="text-amber-600 font-medium">Event day</p>
                  )}
                </div>
              );
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="ourRate"
            stroke={chartColors.primary}
            strokeWidth={2}
            name="Our Rate"
            dot={{ r: 3 }}
            connectNulls
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="compAvg"
            stroke={chartColors.comparison}
            strokeWidth={2}
            name="Comp Avg"
            dot={{ r: 2 }}
            connectNulls
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="recommended"
            stroke={chartColors.recommended}
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Recommended"
            dot={{ r: 2 }}
            connectNulls
          />
          <Bar
            yAxisId="right"
            dataKey="occupancy"
            fill={chartColors.occupancy}
            opacity={0.3}
            name="Occupancy %"
            barSize={20}
          />
          {eventDots.map((dot, i) => (
            <ReferenceDot
              key={i}
              yAxisId="left"
              x={dot.x}
              y={dot.y}
              r={6}
              fill={chartColors.warning}
              stroke={chartColors.surface}
              strokeWidth={2}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
