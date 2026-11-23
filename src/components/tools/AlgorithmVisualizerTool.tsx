"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  Copy,
  Pause,
  Play,
  RotateCcw,
  Search,
  Shuffle,
  SlidersHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type AlgorithmId =
  | "bubble"
  | "selection"
  | "insertion"
  | "quick"
  | "linear"
  | "binary";

type AlgorithmStep = {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  pivotOrMid: number[];
  eliminated: number[];
  foundIndex: number | null;
  comparisons: number;
  swaps: number;
  message: string;
};

type AlgorithmMeta = {
  id: AlgorithmId;
  name: string;
  shortName: string;
  kind: "sort" | "search";
  best: string;
  average: string;
  worst: string;
  space: string;
  summary: string;
  pythonCode: string;
  cppCode: string;
};

const ALGORITHMS: AlgorithmMeta[] = [
  {
    id: "bubble",
    name: "Sắp xếp nổi bọt (Bubble Sort)",
    shortName: "Bubble Sort",
    kind: "sort",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    summary:
      "So sánh từng cặp phần tử liền kề và hoán đổi nếu đứng sai thứ tự, đẩy phần tử lớn nhất nổi dần về cuối dãy sau mỗi lượt.",
    pythonCode: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,
    cppCode: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
  },
  {
    id: "selection",
    name: "Sắp xếp chọn (Selection Sort)",
    shortName: "Selection Sort",
    kind: "sort",
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    summary:
      "Ở mỗi bước i, tìm phần tử nhỏ nhất trong đoạn chưa sắp xếp [i..n-1] rồi hoán đổi nó về đúng vị trí i.",
    pythonCode: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
    cppCode: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx != i) {
            swap(arr[i], arr[minIdx]);
        }
    }
}`,
  },
  {
    id: "insertion",
    name: "Sắp xếp chèn (Insertion Sort)",
    shortName: "Insertion Sort",
    kind: "sort",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    summary:
      "Duyệt từ phần tử thứ 2, lấy giá trị key và dịch chuyển các phần tử lớn hơn sang phải để chèn key vào đúng vị trí trong đoạn đã sắp xếp.",
    pythonCode: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
    cppCode: `void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
  },
  {
    id: "quick",
    name: "Sắp xếp nhanh (Quick Sort)",
    shortName: "Quick Sort",
    kind: "sort",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
    space: "O(log n)",
    summary:
      "Chiến lược Chia để trị: chọn phần tử chốt (pivot), phân hoạch mảng thành phần nhỏ hơn pivot và lớn hơn pivot, rồi đệ quy hai nửa.",
    pythonCode: `def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)`,
    cppCode: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
  },
  {
    id: "linear",
    name: "Tìm kiếm tuần tự (Linear Search)",
    shortName: "Linear Search",
    kind: "search",
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(1)",
    summary:
      "Duyệt lần lượt từng phần tử từ đầu đến cuối mảng, so sánh với giá trị cần tìm X cho đến khi gặp hoặc hết mảng.",
    pythonCode: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,
    cppCode: `int linearSearch(const vector<int>& arr, int target) {
    for (int i = 0; i < (int)arr.size(); i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`,
  },
  {
    id: "binary",
    name: "Tìm kiếm nhị phân (Binary Search)",
    shortName: "Binary Search",
    kind: "search",
    best: "O(1)",
    average: "O(log n)",
    worst: "O(log n)",
    space: "O(1)",
    summary:
      "Áp dụng trên mảng đã sắp xếp tăng dần: ở mỗi bước kiểm tra phần tử giữa mid, loại bỏ ngay một nửa không chứa X.",
    pythonCode: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
    cppCode: `int binarySearch(const vector<int>& arr, int target) {
    int left = 0, right = (int)arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
  },
];

function makeStep(
  arr: number[],
  partial: Partial<Omit<AlgorithmStep, "array">> & { message: string },
): AlgorithmStep {
  return {
    array: [...arr],
    comparing: partial.comparing ?? [],
    swapping: partial.swapping ?? [],
    sorted: partial.sorted ?? [],
    pivotOrMid: partial.pivotOrMid ?? [],
    eliminated: partial.eliminated ?? [],
    foundIndex: partial.foundIndex ?? null,
    comparisons: partial.comparisons ?? 0,
    swaps: partial.swaps ?? 0,
    message: partial.message,
  };
}

function generateSteps(algo: AlgorithmId, initial: number[], target: number): AlgorithmStep[] {
  const arr = [...initial];
  const n = arr.length;
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;
  let swaps = 0;

  if (n === 0) {
    return [makeStep([], { message: "Mảng rỗng — hãy nhập ít nhất 1 số." })];
  }

  if (algo === "bubble") {
    const sorted: number[] = [];
    steps.push(makeStep(arr, { message: "Khởi tạo mảng ban đầu cho Bubble Sort." }));
    for (let i = 0; i < n - 1; i++) {
      let swappedInPass = false;
      for (let j = 0; j < n - 1 - i; j++) {
        comparisons++;
        steps.push(
          makeStep(arr, {
            comparing: [j, j + 1],
            sorted: [...sorted],
            comparisons,
            swaps,
            message: `Lượt ${i + 1}: So sánh arr[${j}] = ${arr[j]} và arr[${j + 1}] = ${arr[j + 1]}.`,
          }),
        );
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swaps++;
          swappedInPass = true;
          steps.push(
            makeStep(arr, {
              swapping: [j, j + 1],
              sorted: [...sorted],
              comparisons,
              swaps,
              message: `Vì ${arr[j + 1]} > ${arr[j]}, hoán đổi vị trí [${j}] và [${j + 1}].`,
            }),
          );
        }
      }
      sorted.push(n - 1 - i);
      if (!swappedInPass) {
        const allIdx = Array.from({ length: n }, (_, k) => k);
        steps.push(
          makeStep(arr, {
            sorted: allIdx,
            comparisons,
            swaps,
            message: "Không có hoán đổi nào ở lượt này → mảng đã sắp xếp hoàn tất sớm!",
          }),
        );
        return steps;
      }
    }
    steps.push(
      makeStep(arr, {
        sorted: Array.from({ length: n }, (_, k) => k),
        comparisons,
        swaps,
        message: "Hoàn thành Bubble Sort! Tất cả phần tử đã đúng thứ tự tăng dần.",
      }),
    );
    return steps;
  }

  if (algo === "selection") {
    const sorted: number[] = [];
    steps.push(makeStep(arr, { message: "Khởi tạo mảng ban đầu cho Selection Sort." }));
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      steps.push(
        makeStep(arr, {
          pivotOrMid: [minIdx],
          sorted: [...sorted],
          comparisons,
          swaps,
          message: `Bắt đầu lượt ${i + 1}: tạm chọn min = arr[${i}] (${arr[i]}).`,
        }),
      );
      for (let j = i + 1; j < n; j++) {
        comparisons++;
        steps.push(
          makeStep(arr, {
            comparing: [j],
            pivotOrMid: [minIdx],
            sorted: [...sorted],
            comparisons,
            swaps,
            message: `So sánh arr[${j}] = ${arr[j]} với min hiện tại arr[${minIdx}] = ${arr[minIdx]}.`,
          }),
        );
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          steps.push(
            makeStep(arr, {
              pivotOrMid: [minIdx],
              sorted: [...sorted],
              comparisons,
              swaps,
              message: `Cập nhật min mới tại chỉ số [${minIdx}] với giá trị ${arr[minIdx]}.`,
            }),
          );
        }
      }
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        swaps++;
        steps.push(
          makeStep(arr, {
            swapping: [i, minIdx],
            sorted: [...sorted],
            comparisons,
            swaps,
            message: `Hoán đổi arr[${i}] và phần tử nhỏ nhất arr[${minIdx}].`,
          }),
        );
      }
      sorted.push(i);
    }
    steps.push(
      makeStep(arr, {
        sorted: Array.from({ length: n }, (_, k) => k),
        comparisons,
        swaps,
        message: "Hoàn thành Selection Sort!",
      }),
    );
    return steps;
  }

  if (algo === "insertion") {
    steps.push(
      makeStep(arr, {
        sorted: [0],
        message: "Khởi tạo Insertion Sort: coi arr[0] đã được sắp xếp.",
      }),
    );
    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;
      steps.push(
        makeStep(arr, {
          pivotOrMid: [i],
          sorted: Array.from({ length: i }, (_, k) => k),
          comparisons,
          swaps,
          message: `Lấy key = arr[${i}] = ${key} để chèn vào đoạn đã sắp xếp [0..${i - 1}].`,
        }),
      );
      while (j >= 0) {
        comparisons++;
        steps.push(
          makeStep(arr, {
            comparing: [j],
            pivotOrMid: [j + 1],
            sorted: Array.from({ length: i }, (_, k) => k),
            comparisons,
            swaps,
            message: `So sánh arr[${j}] = ${arr[j]} với key = ${key}.`,
          }),
        );
        if (arr[j] > key) {
          arr[j + 1] = arr[j];
          swaps++;
          steps.push(
            makeStep(arr, {
              swapping: [j, j + 1],
              sorted: Array.from({ length: i }, (_, k) => k),
              comparisons,
              swaps,
              message: `Vì ${arr[j]} > ${key}, dịch arr[${j}] sang phải vị trí [${j + 1}].`,
            }),
          );
          j--;
        } else {
          break;
        }
      }
      arr[j + 1] = key;
      steps.push(
        makeStep(arr, {
          sorted: Array.from({ length: i + 1 }, (_, k) => k),
          comparisons,
          swaps,
          message: `Chèn key = ${key} vào vị trí [${j + 1}].`,
        }),
      );
    }
    steps.push(
      makeStep(arr, {
        sorted: Array.from({ length: n }, (_, k) => k),
        comparisons,
        swaps,
        message: "Hoàn thành Insertion Sort!",
      }),
    );
    return steps;
  }

  if (algo === "quick") {
    const sortedSet = new Set<number>();
    steps.push(makeStep(arr, { message: "Khởi tạo mảng ban đầu cho Quick Sort (pivot = phần tử cuối đoạn)." }));

    const quickSortRec = (low: number, high: number) => {
      if (low > high) return;
      if (low === high) {
        sortedSet.add(low);
        return;
      }
      const pivot = arr[high];
      let i = low - 1;
      steps.push(
        makeStep(arr, {
          pivotOrMid: [high],
          sorted: Array.from(sortedSet),
          comparisons,
          swaps,
          message: `Phân hoạch đoạn [${low}..${high}] với pivot = arr[${high}] (${pivot}).`,
        }),
      );
      for (let j = low; j < high; j++) {
        comparisons++;
        steps.push(
          makeStep(arr, {
            comparing: [j],
            pivotOrMid: [high],
            sorted: Array.from(sortedSet),
            comparisons,
            swaps,
            message: `So sánh arr[${j}] = ${arr[j]} với pivot = ${pivot}.`,
          }),
        );
        if (arr[j] <= pivot) {
          i++;
          if (i !== j) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            swaps++;
            steps.push(
              makeStep(arr, {
                swapping: [i, j],
                pivotOrMid: [high],
                sorted: Array.from(sortedSet),
                comparisons,
                swaps,
                message: `${arr[i]} <= ${pivot} → hoán đổi arr[${i}] và arr[${j}].`,
              }),
            );
          }
        }
      }
      if (i + 1 !== high) {
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        swaps++;
      }
      const pi = i + 1;
      sortedSet.add(pi);
      steps.push(
        makeStep(arr, {
          swapping: [pi],
          sorted: Array.from(sortedSet),
          comparisons,
          swaps,
          message: `Đặt pivot ${pivot} vào đúng vị trí cố định [${pi}].`,
        }),
      );
      quickSortRec(low, pi - 1);
      quickSortRec(pi + 1, high);
    };

    quickSortRec(0, n - 1);
    steps.push(
      makeStep(arr, {
        sorted: Array.from({ length: n }, (_, k) => k),
        comparisons,
        swaps,
        message: "Hoàn thành Quick Sort!",
      }),
    );
    return steps;
  }

  if (algo === "linear") {
    steps.push(
      makeStep(arr, {
        message: `Bắt đầu Tìm kiếm tuần tự giá trị X = ${target} từ chỉ số 0.`,
      }),
    );
    const eliminated: number[] = [];
    for (let i = 0; i < n; i++) {
      comparisons++;
      steps.push(
        makeStep(arr, {
          comparing: [i],
          eliminated: [...eliminated],
          comparisons,
          swaps,
          message: `Kiểm tra arr[${i}] = ${arr[i]} có bằng ${target} không?`,
        }),
      );
      if (arr[i] === target) {
        steps.push(
          makeStep(arr, {
            sorted: [i],
            foundIndex: i,
            eliminated: [...eliminated],
            comparisons,
            swaps,
            message: `Tìm thấy X = ${target} tại chỉ số [${i}] sau ${comparisons} phép so sánh!`,
          }),
        );
        return steps;
      }
      eliminated.push(i);
    }
    steps.push(
      makeStep(arr, {
        eliminated,
        comparisons,
        swaps,
        message: `Không tìm thấy giá trị ${target} trong mảng (trả về -1).`,
      }),
    );
    return steps;
  }

  // Binary search (requires ascending sorted array)
  const sortedArr = [...arr].sort((a, b) => a - b);
  steps.push(
    makeStep(sortedArr, {
      message: `Mảng đã sắp xếp tăng dần để chạy Tìm kiếm nhị phân giá trị X = ${target}.`,
    }),
  );
  let left = 0;
  let right = sortedArr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const elim: number[] = [];
    for (let k = 0; k < sortedArr.length; k++) {
      if (k < left || k > right) elim.push(k);
    }
    comparisons++;
    steps.push(
      makeStep(sortedArr, {
        pivotOrMid: [mid],
        comparing: [left, right],
        eliminated: elim,
        comparisons,
        swaps,
        message: `Khoảng [${left}..${right}], chọn mid = ${mid} (arr[${mid}] = ${sortedArr[mid]}). So sánh với X = ${target}.`,
      }),
    );
    if (sortedArr[mid] === target) {
      steps.push(
        makeStep(sortedArr, {
          sorted: [mid],
          foundIndex: mid,
          eliminated: elim,
          comparisons,
          swaps,
          message: `Tìm thấy X = ${target} tại chỉ số [${mid}] chỉ sau ${comparisons} phép so sánh!`,
        }),
      );
      return steps;
    }
    if (sortedArr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  steps.push(
    makeStep(sortedArr, {
      eliminated: Array.from({ length: sortedArr.length }, (_, k) => k),
      comparisons,
      swaps,
      message: `Khoảng tìm kiếm rỗng → không tìm thấy X = ${target} (trả về -1).`,
    }),
  );
  return steps;
}

const DEFAULT_ARRAY = [64, 34, 25, 12, 22, 11, 90, 45];

export function AlgorithmVisualizerTool() {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmId>("bubble");
  const [arrayInput, setArrayInput] = useState<string>(DEFAULT_ARRAY.join(", "));
  const [baseArray, setBaseArray] = useState<number[]>(DEFAULT_ARRAY);
  const [targetInput, setTargetInput] = useState<string>("25");
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(450);
  const [copiedLang, setCopiedLang] = useState<"python" | "cpp" | null>(null);

  const meta = useMemo(
    () => ALGORITHMS.find((a) => a.id === selectedAlgo) ?? ALGORITHMS[0],
    [selectedAlgo],
  );

  const targetNum = useMemo(() => {
    const parsed = Number(targetInput.trim());
    return Number.isFinite(parsed) ? parsed : 25;
  }, [targetInput]);

  const steps = useMemo(
    () => generateSteps(selectedAlgo, baseArray, targetNum),
    [selectedAlgo, baseArray, targetNum],
  );

  const clampedStepIdx = Math.min(stepIdx, Math.max(0, steps.length - 1));
  const currentStep = steps[clampedStepIdx] ?? steps[0];
  const activePlaying = isPlaying && clampedStepIdx < steps.length - 1;

  useEffect(() => {
    if (!activePlaying) return;
    const timer = setTimeout(() => {
      const next = Math.min(clampedStepIdx + 1, steps.length - 1);
      setStepIdx(next);
      if (next >= steps.length - 1) {
        setIsPlaying(false);
      }
    }, speedMs);
    return () => clearTimeout(timer);
  }, [activePlaying, clampedStepIdx, steps.length, speedMs]);

  const handleApplyInput = () => {
    const parsed = arrayInput
      .split(/[\s,;]+/)
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n) && n >= 1 && n <= 999)
      .slice(0, 18);
    if (parsed.length >= 2) {
      setBaseArray(parsed);
      setArrayInput(parsed.join(", "));
      setStepIdx(0);
      setIsPlaying(false);
    }
  };

  const handleRandomize = () => {
    const len = 10;
    const next = Array.from({ length: len }, () => Math.floor(Math.random() * 88) + 10);
    setBaseArray(next);
    setArrayInput(next.join(", "));
    setTargetInput(String(next[Math.floor(Math.random() * next.length)]));
    setStepIdx(0);
    setIsPlaying(false);
  };

  const handleSelectAlgo = (id: AlgorithmId) => {
    setSelectedAlgo(id);
    setStepIdx(0);
    setIsPlaying(false);
  };

  const handleCopyCode = async (lang: "python" | "cpp", text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLang(lang);
      setTimeout(() => setCopiedLang(null), 1800);
    } catch {
      // Ignore clipboard failure
    }
  };

  const maxBarVal = Math.max(...currentStep.array, 1);

  return (
    <div className="space-y-6">
      {/* Algorithm Selector & Complexity Info */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap gap-2">
          {ALGORITHMS.map((algo) => {
            const active = algo.id === selectedAlgo;
            return (
              <button
                key={algo.id}
                type="button"
                onClick={() => handleSelectAlgo(algo.id)}
                className={cn(
                  "min-h-10 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer sm:text-sm",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/[0.05] text-muted-foreground hover:bg-foreground/[0.09] hover:text-foreground",
                )}
              >
                {algo.shortName}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 border-t border-border/60 pt-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
              {meta.name}
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {meta.summary}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
              Tốt nhất: {meta.best}
            </Badge>
            <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300">
              Trung bình: {meta.average}
            </Badge>
            <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-300">
              Xấu nhất: {meta.worst}
            </Badge>
            <Badge>Bộ nhớ: {meta.space}</Badge>
          </div>
        </div>
      </div>

      {/* Controls & Array Input */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className={cn("space-y-1.5", meta.kind === "search" ? "lg:col-span-6" : "lg:col-span-8")}>
            <label className="block text-xs font-semibold text-foreground">
              Dãy số tùy chỉnh (2–18 số từ 1 đến 999, cách nhau bằng dấu phẩy)
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleApplyInput();
                }}
                className="min-h-10 flex-1 rounded-xl border border-border/70 bg-background/80 px-3 font-mono text-sm text-foreground outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={handleApplyInput}
                className="min-h-10 rounded-xl bg-foreground/[0.07] px-3.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.12] cursor-pointer"
              >
                Áp dụng
              </button>
              <button
                type="button"
                onClick={handleRandomize}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border/70 bg-background/80 px-3.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.06] cursor-pointer"
              >
                <Shuffle className="h-3.5 w-3.5" />
                <span>Ngẫu nhiên</span>
              </button>
            </div>
          </div>

          {meta.kind === "search" && (
            <div className="lg:col-span-2 space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Giá trị cần tìm (X)
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="number"
                  value={targetInput}
                  onChange={(e) => {
                    setTargetInput(e.target.value);
                    setStepIdx(0);
                    setIsPlaying(false);
                  }}
                  className="min-h-10 w-full rounded-xl border border-border/70 bg-background/80 pl-8 pr-3 font-mono text-sm text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          <div className="lg:col-span-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span className="inline-flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                <span>Tốc độ chạy</span>
              </span>
              <span className="font-mono text-muted-foreground">{speedMs} ms/bước</span>
            </div>
            <input
              type="range"
              min={100}
              max={1200}
              step={50}
              value={1300 - speedMs}
              onChange={(e) => setSpeedMs(1300 - Number(e.target.value))}
              aria-label="Tốc độ mô phỏng"
              className="h-10 w-full accent-primary cursor-pointer"
            />
          </div>
        </div>

        {/* Playback Controls + Live Counters */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (clampedStepIdx >= steps.length - 1) setStepIdx(0);
                setIsPlaying((p) => !p);
              }}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground hover:opacity-90 cursor-pointer"
            >
              {activePlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
              <span>{activePlaying ? "Tạm dừng" : "Chạy tự động"}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setStepIdx((prev) => Math.max(0, prev - 1));
              }}
              disabled={clampedStepIdx === 0}
              className="inline-flex min-h-10 items-center gap-1 rounded-xl border border-border/70 bg-background/80 px-3 text-xs font-semibold text-foreground disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Lùi bước</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setStepIdx((prev) => Math.min(steps.length - 1, prev + 1));
              }}
              disabled={clampedStepIdx >= steps.length - 1}
              className="inline-flex min-h-10 items-center gap-1 rounded-xl border border-border/70 bg-background/80 px-3 text-xs font-semibold text-foreground disabled:opacity-40 cursor-pointer"
            >
              <span>Tiến bước</span>
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setStepIdx(0);
              }}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border/70 bg-background/80 px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.06] cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Đặt lại</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            <span className="rounded-xl bg-foreground/[0.06] px-3 py-1.5 text-foreground">
              Bước: <strong className="font-mono text-primary">{clampedStepIdx}</strong> / {steps.length - 1}
            </span>
            <span className="rounded-xl bg-amber-500/15 px-3 py-1.5 text-amber-700 dark:text-amber-300">
              Số lần so sánh: <strong className="font-mono">{currentStep.comparisons}</strong>
            </span>
            {meta.kind === "sort" && (
              <span className="rounded-xl bg-rose-500/15 px-3 py-1.5 text-rose-700 dark:text-rose-300">
                Hoán đổi / Dịch chuyển: <strong className="font-mono">{currentStep.swaps}</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Visual Bar Stage */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-5">
        {selectedAlgo === "binary" && (
          <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-xs font-medium text-foreground">
            Lưu ý chuẩn Tin học 11: Tìm kiếm nhị phân yêu cầu mảng có thứ tự, hệ thống tự động sắp xếp tăng dần dãy số của bạn để mô phỏng chính xác từng bước chia đôi.
          </div>
        )}

        <div className="flex h-64 items-end justify-center gap-2 rounded-xl bg-slate-950/90 px-4 pb-6 pt-8 sm:gap-3">
          {currentStep.array.map((val, idx) => {
            const isSwapping = currentStep.swapping.includes(idx);
            const isComparing = currentStep.comparing.includes(idx);
            const isSorted = currentStep.sorted.includes(idx) || currentStep.foundIndex === idx;
            const isPivot = currentStep.pivotOrMid.includes(idx);
            const isEliminated = currentStep.eliminated.includes(idx);

            const heightPct = Math.max(14, Math.round((val / maxBarVal) * 100));

            let barColor = "bg-sky-500";
            if (isEliminated) barColor = "bg-slate-700/60 opacity-45";
            if (isSorted) barColor = "bg-emerald-500";
            if (isPivot) barColor = "bg-violet-500";
            if (isComparing) barColor = "bg-amber-400";
            if (isSwapping) barColor = "bg-rose-500";

            return (
              <div
                key={`${idx}-${currentStep.array.length}`}
                className="flex h-full flex-1 max-w-14 flex-col items-center justify-end gap-1.5"
              >
                <span className="font-mono text-[11px] font-bold text-slate-100 sm:text-xs">
                  {val}
                </span>
                <div
                  style={{ height: `${heightPct}%` }}
                  className={cn(
                    "w-full rounded-t-lg transition-all duration-200",
                    barColor,
                  )}
                />
                <span className="font-mono text-[10px] text-slate-400">[{idx}]</span>
              </div>
            );
          })}
        </div>

        {/* Color Legend & Current Step Narration */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="rounded-xl border border-border/70 bg-background/80 px-4 py-2.5 text-xs font-medium text-foreground sm:text-sm">
            {currentStep.message}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-muted-foreground shrink-0">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-amber-400" /> Đang so sánh
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-rose-500" /> Hoán đổi
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-violet-500" /> Chốt / Mid
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-emerald-500" /> Đúng vị trí / Tìm thấy
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Python & C++ Sample Code */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/85">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              <span className="font-heading text-sm font-bold text-foreground">
                Code mẫu Python ({meta.shortName})
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopyCode("python", meta.pythonCode)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-foreground/[0.06] px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
            >
              {copiedLang === "python" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedLang === "python" ? "Đã chép" : "Chép Python"}</span>
            </button>
          </div>
          <pre className="overflow-x-auto bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-100">
            <code>{meta.pythonCode}</code>
          </pre>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/85">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              <span className="font-heading text-sm font-bold text-foreground">
                Code mẫu C++ ({meta.shortName})
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopyCode("cpp", meta.cppCode)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-foreground/[0.06] px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
            >
              {copiedLang === "cpp" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedLang === "cpp" ? "Đã chép" : "Chép C++"}</span>
            </button>
          </div>
          <pre className="overflow-x-auto bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-100">
            <code>{meta.cppCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
