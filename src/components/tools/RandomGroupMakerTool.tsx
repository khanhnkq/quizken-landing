"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Crown, Download, Shuffle, Sparkles, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const SAMPLE_LIST = [
  "Nguyễn Minh Anh",
  "Trần Hoàng Bảo",
  "Lê Ngọc Châu",
  "Phạm Đức Dũng",
  "Hoàng Thu Hà",
  "Vũ Quang Huy",
  "Đặng Khánh Linh",
  "Bùi Gia Minh",
  "Đỗ Thảo Nguyên",
  "Ngô Tuấn Phong",
  "Dương Bảo Quyên",
  "Lý Hải Sơn",
  "Tạ Gia Bảo",
  "Phan Thanh Trúc",
  "Võ Quốc Việt",
  "Mai Xuân Yến",
];

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function RandomGroupMakerTool() {
  const [rawText, setRawText] = useState<string>(SAMPLE_LIST.join("\n"));
  const [splitMode, setSplitMode] = useState<"by-groups" | "by-size">("by-groups");
  const [groupCount, setGroupCount] = useState<number>(4);
  const [groupSize, setGroupSize] = useState<number>(4);
  const [groupPrefix, setGroupPrefix] = useState<string>("Nhóm");
  const [pickLeader, setPickLeader] = useState<boolean>(true);
  const [seed, setSeed] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  const students = useMemo(() => {
    return rawText
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [rawText]);

  const groups = useMemo(() => {
    if (students.length === 0) return [];

    const rng = mulberry32(seed * 9973 + students.length);
    const shuffled = [...students];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const numGroups =
      splitMode === "by-groups"
        ? Math.min(shuffled.length, Math.max(1, groupCount))
        : Math.max(1, Math.ceil(shuffled.length / Math.max(1, groupSize)));

    const buckets: string[][] = Array.from({ length: numGroups }, () => []);
    shuffled.forEach((student, idx) => {
      buckets[idx % numGroups].push(student);
    });

    return buckets.map((members, idx) => ({
      id: idx + 1,
      title: `${groupPrefix.trim() || "Nhóm"} ${idx + 1}`,
      leader: pickLeader && members.length > 0 ? members[0] : null,
      members,
    }));
  }, [students, splitMode, groupCount, groupSize, groupPrefix, pickLeader, seed]);

  const handleCopyZalo = async () => {
    if (groups.length === 0) return;
    const text = groups
      .map((g) => {
        const rows = g.members.map((m, i) =>
          g.leader === m ? `  ${i + 1}. ★ ${m} (Nhóm trưởng)` : `  ${i + 1}. ${m}`,
        );
        return `📌 ${g.title} (${g.members.length} thành viên):\n${rows.join("\n")}`;
      })
      .join("\n\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleDownloadCsv = () => {
    if (groups.length === 0) return;
    const rows = ["Nhóm,Họ và tên,Vai trò"];
    for (const g of groups) {
      for (const m of g.members) {
        const role = g.leader === m ? "Nhóm trưởng" : "Thành viên";
        rows.push(`"${g.title.replace(/"/g, '""')}","${m.replace(/"/g, '""')}","${role}"`);
      }
    }
    const blob = new Blob(["\uFEFF" + rows.join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chia-nhom-lop-hoc-quizken.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Config */}
      <div className="space-y-4 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-heading text-lg font-bold text-foreground">
            1. Danh sách &amp; Cài đặt chia nhóm
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRawText(SAMPLE_LIST.join("\n"))}
              className="inline-flex min-h-10 items-center gap-1 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Mẫu 16 HS</span>
            </button>
            <button
              type="button"
              onClick={() => setRawText("")}
              className="inline-flex min-h-10 items-center gap-1 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Xóa</span>
            </button>
          </div>
        </div>

        <textarea
          aria-label="Danh sách thành viên"
          rows={8}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder={"Dán danh sách mỗi tên một dòng..."}
          className="w-full rounded-xl border border-border bg-background p-3.5 text-sm leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />

        <div className="text-xs font-semibold text-muted-foreground">
          Tổng sĩ số nhận diện:{" "}
          <strong className="text-primary">{students.length} thành viên</strong>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSplitMode("by-groups")}
            className={cn(
              "min-h-11 rounded-xl px-3 text-xs font-semibold cursor-pointer",
              splitMode === "by-groups"
                ? "bg-primary text-primary-foreground"
                : "bg-foreground/[0.05] text-muted-foreground hover:text-foreground",
            )}
          >
            Theo số lượng nhóm
          </button>
          <button
            type="button"
            onClick={() => setSplitMode("by-size")}
            className={cn(
              "min-h-11 rounded-xl px-3 text-xs font-semibold cursor-pointer",
              splitMode === "by-size"
                ? "bg-primary text-primary-foreground"
                : "bg-foreground/[0.05] text-muted-foreground hover:text-foreground",
            )}
          >
            Theo sĩ số / nhóm
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {splitMode === "by-groups" ? (
            <label className="space-y-1">
              <span className="block text-xs font-semibold text-foreground">
                Số nhóm (1–20)
              </span>
              <input
                type="number"
                min={1}
                max={20}
                value={groupCount}
                onChange={(e) =>
                  setGroupCount(Math.min(20, Math.max(1, parseInt(e.target.value || "1", 10))))
                }
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground"
              />
            </label>
          ) : (
            <label className="space-y-1">
              <span className="block text-xs font-semibold text-foreground">
                Số người / nhóm
              </span>
              <input
                type="number"
                min={1}
                max={20}
                value={groupSize}
                onChange={(e) =>
                  setGroupSize(Math.min(20, Math.max(1, parseInt(e.target.value || "1", 10))))
                }
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground"
              />
            </label>
          )}

          <label className="space-y-1">
            <span className="block text-xs font-semibold text-foreground">
              Tiền tố tên nhóm
            </span>
            <input
              type="text"
              value={groupPrefix}
              onChange={(e) => setGroupPrefix(e.target.value)}
              placeholder="Nhóm / Tổ / Đội"
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground"
            />
          </label>
        </div>

        <label className="flex min-h-11 items-center justify-between gap-3 rounded-xl bg-foreground/[0.04] px-3.5 py-2 text-xs font-semibold text-foreground cursor-pointer dark:bg-foreground/[0.06] sm:text-sm">
          <span>Tự động bốc thăm Nhóm trưởng</span>
          <input
            type="checkbox"
            checked={pickLeader}
            onChange={(e) => setPickLeader(e.target.checked)}
            className="h-5 w-5 accent-emerald-500 cursor-pointer"
          />
        </label>

        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-heading text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
        >
          <Shuffle className="h-4 w-4" />
          <span>Xáo trộn &amp; Chia nhóm lại</span>
        </button>
      </div>

      {/* Right Groups Output */}
      <div className="space-y-4 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-lg font-bold text-foreground">
              2. Kết quả phân nhóm ({groups.length} nhóm)
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopyZalo}
              disabled={groups.length === 0}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Đã copy gửi Zalo!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy gửi Zalo / Word</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDownloadCsv}
              disabled={groups.length === 0}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-4 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] disabled:opacity-50 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Tải CSV Excel</span>
            </button>
          </div>
        </div>

        {groups.length === 0 ? (
          <div className="rounded-xl bg-foreground/[0.04] p-8 text-center text-sm text-muted-foreground dark:bg-foreground/[0.06]">
            Hãy nhập hoặc dán danh sách thành viên ở khung bên trái để chia nhóm.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {groups.map((group) => (
              <div
                key={group.id}
                className="rounded-xl border border-border/60 bg-foreground/[0.03] p-4 dark:bg-foreground/[0.05] space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2">
                  <span className="font-heading text-base font-bold text-foreground">
                    {group.title}
                  </span>
                  <Badge>{group.members.length} thành viên</Badge>
                </div>
                <ul className="space-y-1.5 text-sm">
                  {group.members.map((member, mIdx) => {
                    const isLeader = group.leader === member;
                    return (
                      <li
                        key={`${member}-${mIdx}`}
                        className="flex items-center justify-between gap-2 text-foreground"
                      >
                        <span className="truncate">
                          <span className="text-xs text-muted-foreground mr-1.5">
                            {mIdx + 1}.
                          </span>
                          <span className={isLeader ? "font-bold text-primary" : ""}>
                            {member}
                          </span>
                        </span>
                        {isLeader && (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                            <Crown className="h-3 w-3" />
                            Trưởng
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
