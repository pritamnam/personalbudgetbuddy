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

export function CategoryPie({ labels, data, colors }: { labels: string[]; data: number[]; colors: string[] }) {
  return (
    <div className="h-72">
      <Pie
        data={{
          labels,
          datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: "#ffffff" }],
        }}
        options={{ ...base, plugins: { ...base.plugins, legend: { position: "right" as const } } }}
      />
    </div>
  );
}

export function BudgetBars({
  labels,
  spent,
  limits,
}: {
  labels: string[];
  spent: number[];
  limits: number[];
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
        options={{ ...base, scales: { y: { beginAtZero: true, grid: { color: "#0000000d" } }, x: { grid: { display: false } } } }}
      />
    </div>
  );
}

export function TrendLine({ labels, data }: { labels: string[]; data: number[] }) {
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
        options={{ ...base, scales: { y: { beginAtZero: true, grid: { color: "#0000000d" } }, x: { grid: { display: false } } } }}
      />
    </div>
  );
}
