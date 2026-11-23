"use client";

import { useEffect, useId, useState } from "react";

/**
 * Normalizes unquoted Mermaid square-bracket labels containing parentheses or colons
 * (e.g. A[Quy chế (2027)] -> A["Quy chế (2027)"]) so Mermaid parser never chokes.
 */
function sanitizeMermaidChart(raw: string): string {
  const trimmed = raw.trim();
  const firstLine = trimmed.split("\n")[0]?.trim() ?? "";
  if (!/^(?:flowchart|graph)\b/i.test(firstLine)) {
    return trimmed;
  }

  return trimmed.replace(
    /\b([A-Za-z0-9_]+)\[([^\]"\n]*[():/][^\]"\n]*)\]/g,
    (_, id: string, label: string) => `${id}["${label.replace(/"/g, "'")}"]`,
  );
}

export function MermaidDiagram({ chart }: { chart: string }) {
  const reactId = useId();
  const [svg, setSvg] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const syncTheme = () => setIsDark(root.classList.contains("dark"));
    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function renderChart() {
      try {
        const mermaidModule = await import("mermaid");
        const mermaid = mermaidModule.default;

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: isDark ? "dark" : "default",
          fontFamily: "var(--font-roboto), ui-sans-serif, system-ui, sans-serif",
          flowchart: {
            htmlLabels: true,
            curve: "basis",
            useMaxWidth: true,
          },
        });

        const safeId = `mermaid-${reactId.replace(/[^a-zA-Z0-9]/g, "")}-${isDark ? "d" : "l"}`;
        const cleaned = sanitizeMermaidChart(chart);
        const { svg: renderedSvg } = await mermaid.render(safeId, cleaned);

        if (!cancelled) {
          setSvg(renderedSvg);
          setHasError(false);
        }
      } catch {
        try {
          const mermaidModule = await import("mermaid");
          const mermaid = mermaidModule.default;
          const fallbackId = `mermaid-raw-${reactId.replace(/[^a-zA-Z0-9]/g, "")}`;
          const { svg: renderedSvg } = await mermaid.render(
            fallbackId,
            chart.trim(),
          );
          if (!cancelled) {
            setSvg(renderedSvg);
            setHasError(false);
          }
        } catch {
          if (!cancelled) {
            setHasError(true);
          }
        }
      }
    }

    renderChart();
    return () => {
      cancelled = true;
    };
  }, [chart, isDark, reactId]);

  if (hasError) {
    return (
      <pre className="my-6 overflow-x-auto rounded-2xl border border-border/70 bg-secondary p-4 text-xs leading-relaxed text-foreground">
        <code>{chart}</code>
      </pre>
    );
  }

  return (
    <figure
      aria-label="Sơ đồ minh họa"
      className="not-prose my-8 overflow-x-auto rounded-2xl border border-border/70 bg-card/95 p-5 sm:p-6"
    >
      {svg ? (
        <div
          className="flex justify-center [&_svg]:h-auto [&_svg]:max-w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="flex min-h-36 items-center justify-center text-xs font-medium text-muted-foreground">
          Đang tải sơ đồ minh họa...
        </div>
      )}
    </figure>
  );
}
