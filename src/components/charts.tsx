import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  Legend,
);

const base = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { boxWidth: 12, usePointStyle: true, font: { family: "Plus Jakarta Sans" } } },
  },
};

const fmt = (currency: string) => (n: number) =>
  n.toLocaleString(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  });

const moneyPlugins = (currency: string) => ({
  ...base.plugins,
  tooltip: {
    callbacks: {
      label: (ctx: { dataset: { label?: string | undefined }; parsed: { y?: number | null | undefined } | number }) => {
        const raw = typeof ctx.parsed === "number" ? ctx.parsed : (ctx.parsed.y ?? 0);
        const name = ctx.dataset.label ? `${ctx.dataset.label}: ` : "";
        return `${name}${fmt(currency)(raw)}`;
      },
    },
  },
});

const moneyAxis = (currency: string) => ({
  y: {
    beginAtZero: true,
    grid: { color: "#0000000d" },
    ticks: { callback: (v: string | number) => fmt(currency)(Number(v)) },
  },
  x: { grid: { display: false } },
});

export function CategoryPie({
  labels,
  data,
  colors,
  currency = "USD",
}: {
  labels: string[];
  data: number[];
  colors: string[];
  currency?: string;
}) {
  return (
    <div className="h-72">
      <Pie
        data={{
          labels,
          datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: "#ffffff" }],
        }}
        options={{
          ...base,
          plugins: { ...moneyPlugins(currency), legend: { position: "right" as const } },
        }}
      />
    </div>
  );
}

export function BudgetBars({
  labels,
  spent,
  limits,
  currency = "USD",
}: {
  labels: string[];
  spent: number[];
  limits: number[];
  currency?: string;
}) {
  return (
    <div className="h-72">
      <Bar
        data={{
          labels,
          datasets: [
            { label: "Spent", data: spent, backgroundColor: "#2f7a6b", borderRadius: 6 },
            { label: "Budget", data: limits, backgroundColor: "#e0a13c80", borderRadius: 6 },
          ],
        }}
        options={{ ...base, plugins: moneyPlugins(currency), scales: moneyAxis(currency) }}
      />
    </div>
  );
}

export function TrendLine({
  labels,
  data,
  currency = "USD",
}: {
  labels: string[];
  data: number[];
  currency?: string;
}) {
  return (
    <div className="h-72">
      <Line
        data={{
          labels,
          datasets: [
            {
              label: "Monthly spend",
              data,
              borderColor: "#2f7a6b",
              backgroundColor: "#2f7a6b26",
              fill: true,
              tension: 0.35,
              pointRadius: 4,
            },
          ],
        }}
        options={{ ...base, plugins: moneyPlugins(currency), scales: moneyAxis(currency) }}
      />
    </div>
  );
}
