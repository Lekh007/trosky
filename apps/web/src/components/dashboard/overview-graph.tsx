"use client";

import { useMemo, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { chartColors } from "@/lib/chart-colors";
import type { OverviewGraphData } from "@hotel-pricing/shared";

interface OverviewGraphProps {
  graphData: OverviewGraphData;
  loading?: boolean;
  graphRange: number;
  onRangeChange: (range: number) => void;
  onDateClick?: (date: string) => void;
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover p-3 shadow-md text-xs min-w-[180px] text-popover-foreground">
      <p className="font-semibold mb-2">{formatShortDate(label)}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}</span>
          </div>
          <span className="font-medium">
            {entry.name === "Occupancy"
              ? entry.value !== null
                ? `${Math.round(entry.value)}%`
                : "—"
              : entry.value !== null
              ? `$${Math.round(entry.value / 100)}`
              : "—"}
          </span>
        </div>
      ))}
    </div>
  );
}

export function OverviewGraph({
  graphData,
  loading,
  graphRange,
  onRangeChange,
  onDateClick,
}: OverviewGraphProps) {
  const chartData = useMemo(
    () =>
      graphData.dates.map((date, i) => {
        const point: Record<string, any> = {
          date,
          dateLabel: formatShortDate(date),
          "Your Hotel": graphData.yourHotel[i],
          "Comp Avg": graphData.compAvg[i],
          Recommended: graphData.recommended[i],
          Occupancy: graphData.occupancy[i],
        };
        graphData.competitors.forEach((comp) => {
          point[comp.name] = comp.data[i];
        });
        return point;
      }),
    [graphData]
  );

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Competitive Rate Comparison</h3>
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-[350px] w-full rounded-lg" />
      </div>
    );
  }

  if (graphData.dates.length === 0) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Competitive Rate Comparison</h3>
        <div className="h-[300px] rounded-lg border-2 border-dashed flex items-center justify-center text-sm text-muted-foreground">
          Rate data collection in progress. Data will appear within 24 hours.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm font-semibold">Competitive Rate Comparison</h3>
        <Tabs
          value={String(graphRange)}
          onValueChange={(v) => onRangeChange(parseInt(v))}
        >
          <TabsList className="h-8">
            <TabsTrigger value="7" className="text-xs px-3 h-6">
              7 Days
            </TabsTrigger>
            <TabsTrigger value="14" className="text-xs px-3 h-6">
              14 Days
            </TabsTrigger>
            <TabsTrigger value="30" className="text-xs px-3 h-6">
              30 Days
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="h-[250px] sm:h-[300px] lg:h-[350px] xl:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            onClick={(data) => {
              if (data?.activeLabel) onDateClick?.(data.activeLabel);
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis
              dataKey="dateLabel"
              tick={{ fontSize: 11, fill: chartColors.axis }}
              tickLine={false}
            />
            <YAxis
              yAxisId="price"
              tick={{ fontSize: 11, fill: chartColors.axis }}
              tickLine={false}
              tickFormatter={(v) => `$${Math.round(v / 100)}`}
              width={50}
            />
            <YAxis
              yAxisId="occ"
              orientation="right"
              tick={{ fontSize: 11, fill: chartColors.axis }}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
              width={40}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              iconSize={8}
            />

            <Bar
              yAxisId="occ"
              dataKey="Occupancy"
              fill={chartColors.occupancy}
              opacity={0.5}
              radius={[2, 2, 0, 0]}
              barSize={graphRange > 14 ? 8 : 16}
            />

            <Line
              yAxisId="price"
              type="monotone"
              dataKey="Your Hotel"
              stroke={chartColors.primary}
              strokeWidth={2.5}
              dot={{ r: 3, fill: chartColors.primary }}
              activeDot={{ r: 5, stroke: chartColors.surface, strokeWidth: 2 }}
              connectNulls
            />

            <Line
              yAxisId="price"
              type="monotone"
              dataKey="Comp Avg"
              stroke={chartColors.comparison}
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              connectNulls
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
            />

            {graphData.competitors.map((comp, i) => (
              <Line
                key={comp.id}
                yAxisId="price"
                type="monotone"
                dataKey={comp.name}
                stroke={chartColors.series[i % chartColors.series.length]}
                strokeWidth={1}
                dot={false}
                opacity={0.6}
                connectNulls
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
