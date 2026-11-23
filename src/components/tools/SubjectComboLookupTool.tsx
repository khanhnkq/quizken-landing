"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw, Search, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type CombinationItem = {
  code: string;
  subjects: [string, string, string];
  majors: string[];
  tag: string;
};

const GDPT_SUBJECTS = [
  "Toán",
  "Ngữ văn",
  "Tiếng Anh",
  "Vật lý",
  "Hóa học",
  "Sinh học",
  "Lịch sử",
  "Địa lý",
  "GDKT&PL",
  "Tin học",
  "Công nghệ",
];

const COMBINATIONS: CombinationItem[] = [
  { code: "A00", subjects: ["Toán", "Vật lý", "Hóa học"], majors: ["Kỹ thuật, Cơ khí, Điện tử", "Công nghệ thông tin", "Kinh tế – Tài chính", "Quân đội, Công an"], tag: "Truyền thống" },
  { code: "A01", subjects: ["Toán", "Vật lý", "Tiếng Anh"], majors: ["CNTT & AI", "Kỹ thuật phần mềm", "Logistics & Chuỗi cung ứng", "Tài chính – Ngân hàng"], tag: "Phổ biến" },
  { code: "A02", subjects: ["Toán", "Vật lý", "Sinh học"], majors: ["Công nghệ sinh học", "Kỹ thuật Y sinh", "Nông nghiệp công nghệ cao"], tag: "Khoa học" },
  { code: "B00", subjects: ["Toán", "Hóa học", "Sinh học"], majors: ["Y khoa, Răng Hàm Mặt", "Dược học", "Điều dưỡng, Y tế công cộng", "Công nghệ thực phẩm"], tag: "Y Dược" },
  { code: "C00", subjects: ["Ngữ văn", "Lịch sử", "Địa lý"], majors: ["Luật học", "Báo chí – Truyền thông", "Sư phạm Văn/Sử/Địa", "Du lịch – Lữ hành"], tag: "Xã hội" },
  { code: "C01", subjects: ["Ngữ văn", "Toán", "Vật lý"], majors: ["Kiến trúc – Xây dựng", "Sư phạm Toán/Lý", "Kinh tế quản lý"], tag: "Kỹ thuật" },
  { code: "C03", subjects: ["Ngữ văn", "Toán", "Lịch sử"], majors: ["Công an, An ninh", "Luật kinh tế", "Quản lý nhà nước"], tag: "Xã hội" },
  { code: "C04", subjects: ["Ngữ văn", "Toán", "Địa lý"], majors: ["Quản trị kinh doanh", "Địa chính – Quy hoạch", "Kinh tế phát triển"], tag: "Xã hội" },
  { code: "C14", subjects: ["Ngữ văn", "Toán", "GDKT&PL"], majors: ["Luật, Kinh tế chính trị", "Quản trị nhân lực", "Marketing"], tag: "GDPT 2018" },
  { code: "C19", subjects: ["Ngữ văn", "Lịch sử", "GDKT&PL"], majors: ["Luật học", "Hành chính công", "Xã hội học"], tag: "GDPT 2018" },
  { code: "C20", subjects: ["Ngữ văn", "Địa lý", "GDKT&PL"], majors: ["Quản lý đất đai", "Du lịch", "Luật hành chính"], tag: "GDPT 2018" },
  { code: "D01", subjects: ["Ngữ văn", "Toán", "Tiếng Anh"], majors: ["Kinh tế quốc tế, Marketing", "Ngôn ngữ Anh", "Luật thương mại", "CNTT & Truyền thông"], tag: "Phổ biến" },
  { code: "D07", subjects: ["Toán", "Hóa học", "Tiếng Anh"], majors: ["Dược học, Hóa dược", "Kinh tế – Tài chính", "Kỹ thuật hóa học", "CNTT"], tag: "Khoa học" },
  { code: "D08", subjects: ["Toán", "Sinh học", "Tiếng Anh"], majors: ["Công nghệ sinh học", "Y học dự phòng", "Khoa học môi trường"], tag: "Khoa học" },
  { code: "D14", subjects: ["Ngữ văn", "Lịch sử", "Tiếng Anh"], majors: ["Quan hệ quốc tế", "Báo chí – Truyền thông", "Đông phương học"], tag: "Xã hội" },
  { code: "D15", subjects: ["Ngữ văn", "Địa lý", "Tiếng Anh"], majors: ["Quản trị dịch vụ du lịch", "Kinh doanh quốc tế", "Logistics"], tag: "Xã hội" },
  { code: "D66", subjects: ["Ngữ văn", "GDKT&PL", "Tiếng Anh"], majors: ["Luật quốc tế", "Quản trị truyền thông", "Quan hệ công chúng"], tag: "GDPT 2018" },
  { code: "X01", subjects: ["Toán", "Ngữ văn", "GDKT&PL"], majors: ["Kinh tế học", "Tài chính – Kế toán", "Luật kinh tế"], tag: "Tổ hợp mới 2025+" },
  { code: "X06", subjects: ["Toán", "Vật lý", "Tin học"], majors: ["Khoa học máy tính", "An toàn thông tin", "Trí tuệ nhân tạo", "Kỹ thuật dữ liệu"], tag: "Tổ hợp mới 2025+" },
  { code: "X07", subjects: ["Toán", "Vật lý", "Công nghệ"], majors: ["Cơ điện tử, Ô tô", "Tự động hóa", "Kỹ thuật công nghiệp"], tag: "Tổ hợp mới 2025+" },
  { code: "X10", subjects: ["Toán", "Hóa học", "Tin học"], majors: ["Khoa học dữ liệu", "Tin sinh học", "Kỹ thuật phần mềm"], tag: "Tổ hợp mới 2025+" },
  { code: "X26", subjects: ["Toán", "Tiếng Anh", "Tin học"], majors: ["Công nghệ thông tin", "Hệ thống thông tin quản lý", "Thương mại điện tử"], tag: "Tổ hợp mới 2025+" },
  { code: "X27", subjects: ["Toán", "Tiếng Anh", "Công nghệ"], majors: ["Thiết kế công nghiệp", "Kỹ thuật điện", "Kiến trúc"], tag: "Tổ hợp mới 2025+" },
  { code: "X54", subjects: ["Toán", "GDKT&PL", "Tiếng Anh"], majors: ["Tài chính ngân hàng", "Kiểm toán", "Quản trị kinh doanh"], tag: "Tổ hợp mới 2025+" },
];

export function SubjectComboLookupTool() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(["Toán", "Vật lý", "Tiếng Anh", "Tin học"]);
  const [query, setQuery] = useState<string>("");

  const toggleSubject = (sub: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : prev.length < 6 ? [...prev, sub] : prev,
    );
  };

  const matched = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COMBINATIONS.filter((item) => {
      const matchesSearch =
        q === "" ||
        item.code.toLowerCase().includes(q) ||
        item.subjects.some((s) => s.toLowerCase().includes(q)) ||
        item.majors.some((m) => m.toLowerCase().includes(q));

      if (!matchesSearch) return false;
      if (selectedSubjects.length === 0) return true;
      // Show combinations whose all 3 subjects are in selectedSubjects (when >=3 picked)
      // or at least overlap with selectedSubjects (when 1-2 picked)
      if (selectedSubjects.length >= 3) {
        return item.subjects.every((s) => selectedSubjects.includes(s));
      }
      return selectedSubjects.every((sel) => item.subjects.includes(sel));
    });
  }, [selectedSubjects, query]);

  const handleReset = () => {
    setSelectedSubjects([]);
    setQuery("");
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="space-y-5 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
              1. Chọn môn thi THPT của bạn hoặc tìm mã khối / ngành học
            </h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Chọn 1–2 môn để xem tổ hợp có chứa môn đó, hoặc chọn 3–4 môn thi tốt nghiệp để lọc các khối bạn đủ điều kiện xét tuyển
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Xem tất cả ({COMBINATIONS.length} khối)
          </button>
        </div>

        {/* Subject Pills */}
        <div className="flex flex-wrap gap-2">
          {GDPT_SUBJECTS.map((sub) => {
            const active = selectedSubjects.includes(sub);
            return (
              <button
                key={sub}
                type="button"
                onClick={() => toggleSubject(sub)}
                className={cn(
                  "min-h-11 rounded-xl border px-3.5 text-xs font-bold transition-colors cursor-pointer sm:text-sm",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/60 bg-foreground/[0.03] text-foreground hover:bg-foreground/[0.07]",
                )}
              >
                {sub}
              </button>
            );
          })}
        </div>

        {/* Search box */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            aria-label="Tìm mã tổ hợp hoặc tên ngành đại học"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo mã khối (A00, D01, X06, X26...) hoặc ngành (CNTT, Y khoa, Luật, Kinh tế)..."
            className="min-h-11 w-full rounded-xl border border-border/70 bg-background pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge className="bg-primary/15 text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Tìm thấy {matched.length} tổ hợp phù hợp</span>
          </Badge>
          {selectedSubjects.length > 0 && (
            <span className="text-xs text-muted-foreground">
              Đang chọn: <strong className="text-foreground">{selectedSubjects.join(", ")}</strong>
            </span>
          )}
        </div>

        {matched.length === 0 ? (
          <div className="rounded-2xl border border-border/70 bg-card/85 p-8 text-center space-y-3">
            <p className="font-heading text-base font-bold text-foreground">
              Chưa tìm thấy tổ hợp khớp với bộ môn đã chọn
            </p>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Hãy chọn thêm môn Toán hoặc Ngữ văn (2 môn thi bắt buộc THPT) hoặc nhấn &quot;Xem tất cả&quot;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {matched.map((item) => (
              <div
                key={item.code}
                className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card/85 p-5 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-heading text-2xl font-extrabold text-primary">
                      {item.code}
                    </span>
                    <Badge className="text-[11px]">{item.tag}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {item.subjects.map((s) => (
                      <span
                        key={s}
                        className="rounded-lg bg-foreground/[0.05] px-2.5 py-1 text-xs font-semibold text-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Nhóm ngành xét tuyển tiêu biểu
                    </p>
                    <ul className="mt-1.5 space-y-1 text-xs text-foreground list-disc pl-4">
                      {item.majors.map((m) => (
                        <li key={m}>{m}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Link
                  href="/cong-cu/tinh-diem-xet-hoc-ba-thpt-2027"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Tính điểm học bạ tổ hợp {item.code}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
