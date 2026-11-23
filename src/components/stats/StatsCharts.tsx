"use client";

import { useState } from "react";
import { Download, BarChart2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const statsData = [
  { name: "QuizKen AI", time: 0.5, engagement: 95, barClass: "bg-primary" },
  {
    name: "Google Forms",
    time: 45,
    engagement: 40,
    barClass: "bg-foreground/30",
  },
  {
    name: "Soạn đề giấy",
    time: 120,
    engagement: 20,
    barClass: "bg-foreground/15",
  },
];

export function StatsCharts() {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        [
          "Cong cu",
          "Thoi gian soan de (phut)",
          "Do tuong tac hoc sinh (%)",
          "AI ho tro",
          "Xuat ban PDF",
        ],
        ["QuizKen AI", "0.5", "95", "Co", "Co"],
        ["Google Forms", "45", "40", "Khong", "Khong"],
        ["Soan de giay thu cong", "120", "20", "Khong", "Co"],
      ]
        .map((e) => e.join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "quizken_comparison_stats.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="mt-10 rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none backdrop-blur-none sm:p-8">
      <div className="flex flex-col items-start justify-between gap-4 pb-6 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground">
            Bảng so sánh hiệu suất soạn đề thi
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Dữ liệu khảo sát so sánh QuizKen AI với các phương pháp truyền thống
          </p>
        </div>
        <Button
          onClick={handleDownloadCSV}
          variant="secondary"
          size="sm"
          className="h-9 shrink-0 rounded-xl border-0 shadow-none"
        >
          {downloaded ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Đã tải CSV
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Tải dữ liệu CSV
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Chart 1: Time Comparison */}
        <div className="rounded-xl border-0 bg-foreground/[0.04] p-5 shadow-none dark:bg-foreground/[0.06]">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <BarChart2 className="h-4 w-4" />
            Thời gian soạn đề 30 câu (phút - càng thấp càng tốt)
          </h4>
          <div className="mt-5 space-y-4">
            {statsData.map((d) => (
              <div key={d.name + "-time"}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{d.name}</span>
                  <span className="font-mono font-semibold text-foreground">
                    {d.time} phút
                  </span>
                </div>
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-foreground/[0.08]">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      d.barClass,
                    )}
                    style={{
                      width: `${Math.max(3, (d.time / 120) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Engagement Comparison */}
        <div className="rounded-xl border-0 bg-foreground/[0.04] p-5 shadow-none dark:bg-foreground/[0.06]">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <BarChart2 className="h-4 w-4" />
            Độ tương tác học sinh (% - càng cao càng tốt)
          </h4>
          <div className="mt-5 space-y-4">
            {statsData.map((d) => (
              <div key={d.name + "-eng"}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{d.name}</span>
                  <span className="font-mono font-semibold text-foreground">
                    {d.engagement}%
                  </span>
                </div>
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-foreground/[0.08]">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      d.barClass,
                    )}
                    style={{
                      width: `${d.engagement}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
