"use client";

import { useState } from "react";
import {
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Brain,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { appLink } from "@/lib/site";

const PRESET_TOPICS = [
  { id: "history", name: "Lịch sử Việt Nam (Thế kỷ 20)", icon: "🇻🇳", count: 5 },
  { id: "english", name: "Tiếng Anh: Từ vựng IELTS/TOEIC", icon: "🇬🇧", count: 5 },
  { id: "science", name: "Sinh học: Hệ sinh thái & Đột biến", icon: "🧬", count: 5 },
  { id: "geo", name: "Địa lý: Địa hình & Khí hậu Việt Nam", icon: "🌏", count: 5 },
];

const SAMPLE_QUESTIONS: Record<
  string,
  {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  }[]
> = {
  history: [
    {
      question: "Chiến dịch Điện Biên Phủ lịch sử kết thúc thắng lợi vào ngày tháng năm nào?",
      options: ["07/05/1954", "30/04/1975", "19/08/1945", "02/09/1945"],
      correct: 0,
      explanation: "Chiến dịch Điện Biên Phủ giành thắng lợi hoàn toàn vào chiều ngày 7/5/1954 khi tướng De Castries bị bắt sống.",
    },
    {
      question: "Bản Tuyên ngôn Độc lập được Chủ tịch Hồ Chí Minh đọc tại đâu?",
      options: ["Quảng trường Ba Đình", "Bến Nhà Rồng", "Tân Trào", "Hang Pắc Bó"],
      correct: 0,
      explanation: "Ngày 2/9/1945, Bác Hồ đọc bản Tuyên ngôn Độc lập tại Quảng trường Ba Đình, Hà Nội.",
    },
  ],
  english: [
    {
      question: "Choose the synonym for 'ubiquitous':",
      options: ["Rare", "Omnipresent", "Fragile", "Obsolete"],
      correct: 1,
      explanation: "'Ubiquitous' means present, appearing, or found everywhere (omnipresent).",
    },
    {
      question: "Which word correctly completes: 'The AI _____ accurate quizzes instantly.'?",
      options: ["generates", "generating", "generated", "generate"],
      correct: 0,
      explanation: "Subject 'The AI' is third-person singular, requiring verb 'generates' in present simple tense.",
    },
  ],
  science: [
    {
      question: "Đơn vị cấu tạo nên ADN là gì?",
      options: ["Nuclêôtit", "Axit amin", "Glucôzơ", "Lần nơron"],
      correct: 0,
      explanation: "ADN là đại phân tử sinh học được cấu tạo theo nguyên tắc đa phân từ các đơn phân là Nuclêôtit (A, T, G, X).",
    },
  ],
  geo: [
    {
      question: "Đỉnh núi cao nhất Việt Nam và Đông Dương là đỉnh nào?",
      options: ["Fansipan (3.143m)", "Mẫu Sơn", "Bạch Mã", "Langbiang"],
      correct: 0,
      explanation: "Fansipan nằm ở dãy Hoàng Liên Sơn có độ cao 3.143m, được mệnh danh là 'Nóc nhà Đông Dương'.",
    },
  ],
};

export function QuizGeneratorDemo() {
  const [selectedTopic, setSelectedTopic] = useState("history");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<any[] | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedQuiz(null);
    setUserAnswers({});
    setShowExplanation({});

    setTimeout(() => {
      const questions = SAMPLE_QUESTIONS[selectedTopic] || SAMPLE_QUESTIONS.history;
      setGeneratedQuiz(questions);
      setIsGenerating(false);
    }, 1200);
  };

  const handleSelectOption = (qIdx: number, oIdx: number) => {
    setUserAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
    setShowExplanation((prev) => ({ ...prev, [qIdx]: true }));
  };

  return (
    <section id="demo-generator" className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-background via-emerald-50/30 to-background dark:via-emerald-950/10">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="eyebrow mx-auto mb-4">
            <Sparkles className="h-4 w-4 fill-emerald-500 text-emerald-500" />
            <span>Trải nghiệm tạo đề trực tiếp</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight">
            Thử Tạo Bài Kiểm Tra <span className="text-gradient">AI Ngay Bây Giờ</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Chọn chủ đề mẫu hoặc nhập nội dung bất kỳ. AI của QuizKen sẽ biên soạn bộ câu hỏi trắc nghiệm chất lượng chuẩn thi cử chỉ trong 2 giây!
          </p>
        </div>

        {/* Generator Box Container */}
        <div className="max-w-4xl mx-auto rounded-3xl border-4 border-emerald-200 dark:border-emerald-900 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-2xl p-6 sm:p-10 transition-all duration-300">
          
          {/* Top Options Bar */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-700 font-heading text-foreground mb-3">
                1. Chọn chủ đề có sẵn hoặc tự nhập:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRESET_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => {
                      setSelectedTopic(topic.id);
                      setCustomPrompt("");
                    }}
                    className={`flex items-center gap-2 p-3 rounded-2xl border-2 text-xs sm:text-sm font-bold transition-all text-left ${
                      selectedTopic === topic.id && !customPrompt
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 shadow-md scale-102"
                        : "border-border/60 hover:border-emerald-300 bg-card text-foreground/80"
                    }`}
                  >
                    <span className="text-lg">{topic.icon}</span>
                    <span className="line-clamp-2 leading-tight">{topic.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="relative">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Hoặc nhập chủ đề tự chọn: VD 'Vật lý lớp 12 Định luật Ôm', 'TOEIC Listening'..."
                className="w-full rounded-2xl border-2 border-border/70 bg-background px-4 py-3.5 pl-11 text-sm font-medium focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/15 transition-all"
              />
              <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            {/* Generate Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-border/50">
              <div className="flex items-center gap-4 text-xs font-600 text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  AI Model: Gemini Flash Fast
                </span>
                <span>• 5 Câu hỏi</span>
                <span>• 4 Lựa chọn</span>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full sm:w-auto px-8 py-4 rounded-[2rem] bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-800 text-base shadow-lg shadow-emerald-500/25 border-4 border-white/20 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="h-5 w-5 animate-spin" />
                    AI Đang Soạn Đề...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 fill-white" />
                    Tạo Đề Thử Bằng AI
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Result Output */}
          {isGenerating && (
            <div className="mt-8 p-8 text-center rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/30 animate-pulse">
              <Brain className="h-10 w-10 text-emerald-500 mx-auto animate-bounce mb-3" />
              <p className="font-heading text-lg font-bold text-emerald-800 dark:text-emerald-200">
                AI QuizKen đang biên soạn bộ câu hỏi trắc nghiệm...
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Tự động kiểm tra kiến thức, tạo đáp án & giải thích chi tiết
              </p>
            </div>
          )}

          {generatedQuiz && !isGenerating && (
            <div className="mt-8 space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between bg-emerald-100/70 dark:bg-emerald-900/40 p-4 rounded-2xl border border-emerald-300 dark:border-emerald-700">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  <span className="font-heading font-bold text-sm text-emerald-900 dark:text-emerald-100">
                    Kết Quả AI Vừa Tạo Thành Công ({generatedQuiz.length} câu hỏi)
                  </span>
                </div>
                <button
                  onClick={handleGenerate}
                  className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 hover:underline"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Tạo Đề Khác
                </button>
              </div>

              {generatedQuiz.map((q, qIdx) => {
                const selectedOpt = userAnswers[qIdx];
                const isAnswered = selectedOpt !== undefined;

                return (
                  <div
                    key={qIdx}
                    className="p-5 sm:p-6 rounded-2xl border-2 border-border/80 bg-card shadow-sm space-y-4"
                  >
                    <p className="font-heading text-base sm:text-lg font-bold leading-snug">
                      <span className="text-emerald-600 dark:text-emerald-400 mr-2">Câu {qIdx + 1}:</span>
                      {q.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((opt: string, oIdx: number) => {
                        let btnStyle = "border-border/60 bg-muted/40 hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40";
                        if (isAnswered) {
                          if (oIdx === q.correct) {
                            btnStyle = "border-emerald-500 bg-emerald-100/80 text-emerald-900 font-bold dark:bg-emerald-900/60 dark:text-emerald-100";
                          } else if (oIdx === selectedOpt && selectedOpt !== q.correct) {
                            btnStyle = "border-rose-400 bg-rose-100/80 text-rose-900 font-bold dark:bg-rose-900/60 dark:text-rose-100";
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectOption(qIdx, oIdx)}
                            className={`p-3 rounded-xl border-2 text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>
                              <strong className="mr-2 text-muted-foreground">
                                {String.fromCharCode(65 + oIdx)}.
                              </strong>
                              {opt}
                            </span>
                            {isAnswered && oIdx === q.correct && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            )}
                            {isAnswered && oIdx === selectedOpt && selectedOpt !== q.correct && (
                              <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {showExplanation[qIdx] && (
                      <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs sm:text-sm text-amber-900 dark:text-amber-200 flex items-start gap-2 animate-fadeIn">
                        <HelpCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Giải thích từ AI:</strong> {q.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="pt-4 text-center">
                <Button href={appLink("/")} size="lg" className="rounded-[2rem] px-8 py-4 font-heading font-800 text-base shadow-xl">
                  Vào App Tạo Bộ Quiz Đầy Đủ (Miễn Phí)
                  <ArrowRight className="h-5 w-5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
