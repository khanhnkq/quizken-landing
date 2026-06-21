import { Container } from "@/components/ui/Container";
import { stats } from "@/lib/content/testimonials";

export function StatsBar() {
  return (
    <section className="border-y border-border/60 bg-secondary/40 backdrop-blur-sm">
      <Container>
        <div className="grid grid-cols-2 divide-border/60 py-10 sm:grid-cols-4 sm:divide-x">
          {stats.map((s) => (
            <div key={s.label} className="px-2 text-center sm:px-6">
              <p className="font-heading text-3xl font-600 tracking-tight sm:text-4xl">
                <span className="text-gradient">{s.value}</span>
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
