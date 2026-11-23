import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { MermaidDiagram } from "@/components/blog/MermaidDiagram";

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-zinc dark:prose-invert prose-headings:font-heading prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-pre:bg-secondary prose-pre:text-foreground max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          pre({ children, ...props }) {
            const child = React.Children.toArray(children)[0];
            if (
              React.isValidElement<{ className?: string; children?: React.ReactNode }>(
                child,
              ) &&
              typeof child.props.className === "string" &&
              child.props.className.includes("language-mermaid")
            ) {
              return <>{children}</>;
            }
            return <pre {...props}>{children}</pre>;
          },
          code({ className, children, ...props }) {
            if (
              typeof className === "string" &&
              className.includes("language-mermaid")
            ) {
              return (
                <MermaidDiagram
                  chart={String(children).replace(/\n$/, "")}
                />
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          table({ children, ...props }) {
            return (
              <div className="my-6 w-full overflow-x-auto rounded-xl border border-border/70">
                <table className="m-0 w-full" {...props}>
                  {children}
                </table>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
