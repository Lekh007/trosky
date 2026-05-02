"use client";

import { Check, X, ClipboardList, RefreshCw, FileText, Eye, Users } from "lucide-react";
import { motion } from "framer-motion";
import { SectionWrapper } from "./section-wrapper";

const rows = [
  {
    feature: "Daily Data Entry",
    icon: ClipboardList,
    traditional: "10+ Hours / Week",
    trosky: "100% Automated",
  },
  {
    feature: "Update Frequency",
    icon: RefreshCw,
    traditional: "Once Daily",
    trosky: "Every 60 Minutes",
  },
  {
    feature: "Reporting",
    icon: FileText,
    traditional: "Manual PDF",
    trosky: "Self-Service",
  },
  {
    feature: "Market Visibility",
    icon: Eye,
    traditional: "Limited",
    trosky: "Real-Time",
  },
  {
    feature: "Stakeholder Access",
    icon: Users,
    traditional: "By Request",
    trosky: "24/7 Portal",
  },
];

export function ComparisonTable() {
  return (
    <SectionWrapper id="comparison" className="landing-bg px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Compare
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            The Efficiency Divide
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            See how traditional workflows compare with automated market
            intelligence.
          </p>
        </motion.div>
        {/* Table cells must stay `display: table-cell`; flex on <td> breaks column layout in browsers. */}
        <div className="mt-14 hidden overflow-hidden rounded-2xl border border-border bg-card shadow-lg md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <colgroup>
                <col className="min-w-[200px] md:w-[38%]" />
                <col className="md:w-[31%]" />
                <col className="md:w-[31%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th
                    scope="col"
                    className="px-5 py-4 text-left text-sm font-semibold text-foreground sm:px-6 sm:py-5"
                  >
                    Feature
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-4 text-left text-sm font-semibold text-muted-foreground sm:px-6 sm:py-5"
                  >
                    Traditional
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-4 text-left text-sm font-semibold text-primary sm:px-6 sm:py-5"
                  >
                    Trosky
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const Icon = row.icon;
                  return (
                    <motion.tr
                      key={row.feature}
                      initial={{ opacity: 0, x: -6 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        type: "spring",
                        stiffness: 150,
                        damping: 24,
                        delay: i * 0.04,
                      }}
                      className={
                        i < rows.length - 1
                          ? "border-b border-border transition-colors hover:bg-muted/20"
                          : "transition-colors hover:bg-muted/20"
                      }
                    >
                      <th
                        scope="row"
                        className="px-5 py-4 text-left align-middle font-normal sm:px-6 sm:py-5"
                      >
                        <span className="flex items-center gap-3 text-sm font-medium text-foreground">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <Icon className="h-4 w-4" />
                          </span>
                          {row.feature}
                        </span>
                      </th>
                      <td className="px-5 py-4 align-middle text-sm text-muted-foreground sm:px-6 sm:py-5">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive"
                            aria-hidden
                          >
                            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                          </span>
                          <span>{row.traditional}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-middle text-sm font-medium text-primary sm:px-6 sm:py-5">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"
                            aria-hidden
                          >
                            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                          </span>
                          <span>{row.trosky}</span>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-10 grid gap-4 md:hidden">
          {rows.map((row, i) => {
            const Icon = row.icon;
            return (
              <motion.div
                key={row.feature}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 24,
                  delay: i * 0.05,
                }}
                className="rounded-2xl border border-border bg-card p-5 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-semibold text-foreground">{row.feature}</p>
                </div>
                <div className="mt-4 flex flex-col gap-2 rounded-lg bg-muted/40 p-3">
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <X className="h-3.5 w-3.5 shrink-0 text-destructive/80" />
                    <span className="font-medium text-muted-foreground">Traditional:</span> {row.traditional}
                  </p>
                  <p className="flex items-center gap-2 text-sm font-medium text-primary">
                    <Check className="h-3.5 w-3.5 shrink-0" />
                    <span>Trosky:</span> {row.trosky}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
