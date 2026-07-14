"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Download, BarChart2, CheckCircle2 } from "lucide-react";

export function StatsCharts() {
  const [downloaded, setDownloaded] = useState(false);

  const statsData = [
    { name: "QuizKen AI", time: 0.5, engagement: 95, color: "var(--primary)" },
    { name: "Google Forms", time: 45, engagement: 40, color: "rgba(255, 255, 255, 0.2)" },
    { name: "Soạn đề giấy", time: 120, engagement: 20, color: "rgba(255, 255, 255, 0.1)" },
  ];

  const handleDownloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        ["Cong cu", "Thoi gian soan de (phut)", "Do tuong tac hoc sinh (%)", "AI ho tro", "Xuat ban PDF"],
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
    <div className="mt-12 rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-heading text-xl font-600">Bảng so sánh hiệu suất soạn đề thi</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Dữ liệu khảo sát so sánh QuizKen AI với các phương pháp truyền thống
          </p>
        </div>
        <Button
          onClick={handleDownloadCSV}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          {downloaded ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
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

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* Chart 1: Time Comparison */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-600 text-muted-foreground">
            <BarChart2 className="h-4 w-4" />
            Thời gian soạn đề 30 câu (phút - càng thấp càng tốt)
          </h4>
          <div className="mt-6 space-y-5">
            {statsData.map((d) => (
              <div key={d.name + "-time"}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{d.name}</span>
                  <span className="font-mono font-600 text-primary">{d.time} phút</span>
                </div>
                <div className="mt-2 h-3.5 w-full overflow-hidden rounded-full bg-secondary/50">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(3, (d.time / 120) * 100)}%`,
                      backgroundColor: d.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Engagement Comparison */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-600 text-muted-foreground">
            <BarChart2 className="h-4 w-4" />
            Độ tương tác học sinh (% - càng cao càng tốt)
          </h4>
          <div className="mt-6 space-y-5">
            {statsData.map((d) => (
              <div key={d.name + "-eng"}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{d.name}</span>
                  <span className="font-mono font-600 text-primary">{d.engagement}%</span>
                </div>
                <div className="mt-2 h-3.5 w-full overflow-hidden rounded-full bg-secondary/50">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${d.engagement}%`,
                      backgroundColor: d.color,
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
