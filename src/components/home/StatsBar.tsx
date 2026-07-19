"use client";

import { Container } from "@/components/ui/Container";

const stats = [
  { value: "100.000+", label: "Bài kiểm tra đã tạo" },
  { value: "500+", label: "Trường học & Giáo viên tin dùng" },
  { value: "98.5%", label: "Tỷ lệ hài lòng" },
  { value: "< 3 Giây", label: "Thời gian AI tạo bài thi" },
];

export function StatsBar() {
  return (
    <section className="py-12 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white relative overflow-hidden shadow-xl">
      <div className="pointer-events-none absolute inset-0 opacity-15 bg-dot-grid" />
      
      <Container className="relative z-10">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/20">
          {stats.map((s, idx) => (
            <div key={idx} className="text-center px-4 pt-4 md:pt-0">
              <p className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-yellow-300 drop-shadow-md">
                {s.value}
              </p>
              <p className="mt-2 text-xs sm:text-sm font-semibold text-emerald-100 uppercase tracking-wider">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
