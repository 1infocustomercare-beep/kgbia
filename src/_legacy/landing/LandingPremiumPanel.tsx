interface LandingPremiumPanelProps {
  eyebrow: string;
  code: string;
  title: string;
  tone?: "teal" | "violet" | "gold" | "slate";
}

const TONE_STYLES: Record<NonNullable<LandingPremiumPanelProps["tone"]>, { shell: string; chip: string; glow: string }> = {
  teal: {
    shell: "border-primary/20 bg-[linear-gradient(135deg,hsl(var(--primary)/0.16),hsl(var(--accent)/0.08)_52%,hsl(var(--card)/0.82)_100%)]",
    chip: "border-primary/20 bg-primary/10",
    glow: "bg-primary/20",
  },
  violet: {
    shell: "border-[hsl(var(--empire-violet)/0.22)] bg-[linear-gradient(135deg,hsl(var(--empire-violet)/0.16),hsl(var(--primary)/0.08)_52%,hsl(var(--card)/0.82)_100%)]",
    chip: "border-[hsl(var(--empire-violet)/0.22)] bg-[hsl(var(--empire-violet)/0.12)]",
    glow: "bg-[hsl(var(--empire-violet)/0.18)]",
  },
  gold: {
    shell: "border-[hsl(var(--gold)/0.24)] bg-[linear-gradient(135deg,hsl(var(--gold)/0.18),hsl(var(--gold-light)/0.08)_52%,hsl(var(--card)/0.82)_100%)]",
    chip: "border-[hsl(var(--gold)/0.22)] bg-[hsl(var(--gold)/0.12)]",
    glow: "bg-[hsl(var(--gold)/0.18)]",
  },
  slate: {
    shell: "border-border/70 bg-[linear-gradient(135deg,hsl(var(--secondary)/0.42),hsl(var(--muted)/0.18)_52%,hsl(var(--card)/0.82)_100%)]",
    chip: "border-border/70 bg-secondary/50",
    glow: "bg-foreground/10",
  },
};

export default function LandingPremiumPanel({
  eyebrow,
  code,
  title,
  tone = "teal",
}: LandingPremiumPanelProps) {
  const styles = TONE_STYLES[tone];

  return (
    <div className={`relative mb-5 h-28 sm:h-32 overflow-hidden rounded-[1.75rem] border ${styles.shell}`}>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--background)/0)_0%,hsl(var(--background)/0.18)_100%)]" />
      <div className="absolute inset-x-5 top-4 flex items-center justify-between gap-3">
        <span className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-foreground/75 ${styles.chip}`}>
          {eyebrow}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-foreground/35">{code}</span>
      </div>

      <div className="absolute left-5 right-5 bottom-5">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-px flex-1 bg-border/80" />
          <div className="h-2.5 w-2.5 rounded-full border border-border/80 bg-card/90" />
        </div>
        <p className="max-w-[12rem] text-sm sm:text-base font-semibold leading-tight text-foreground">
          {title}
        </p>
      </div>

      <div className={`absolute -right-5 bottom-0 h-24 w-24 rounded-full blur-3xl ${styles.glow}`} />

      <div className="absolute right-5 top-1/2 h-14 w-14 -translate-y-1/2 rounded-[1.25rem] border border-border/70 bg-card/25 backdrop-blur-sm">
        <div className="absolute inset-3 rounded-[0.8rem] border border-border/60" />
      </div>
    </div>
  );
}
