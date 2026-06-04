"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as DS from "@/lib/designSystem";
import {
  EditableState,
  DEFAULT_EDITABLE,
  generateFileContent,
  TYPE_KEYS,
  typeClass,
} from "./tokens";

// ─── Util ────────────────────────────────────────────────────────────────────

function clsDisplay(c: string, max = 80) {
  return c.length > max ? c.substring(0, max) + "…" : c;
}

function rgbaToHex(rgba: string): string {
  const m = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!m) return "#000000";
  return "#" + [m[1], m[2], m[3]].map(v => parseInt(v).toString(16).padStart(2, "0")).join("");
}

function parseRgbaAlpha(rgba: string): number {
  const m = rgba.match(/[\d.]+\)$/);
  if (m && m[0].endsWith(")")) {
    const val = parseFloat(m[0].slice(0, -1));
    return isNaN(val) ? 1 : val;
  }
  return 1;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TokenCard({ label, desc, classes, children }: {
  label: string; desc?: string; classes: string; children: React.ReactNode;
}) {
  return (
    <div className="border border-white/[0.06] rounded-sm bg-white/[0.015] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-black/20 border-b border-white/[0.03]">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] font-bold tracking-wider text-tech-blue">{label}</span>
          {desc && <span className="font-mono text-[7px] text-white/20 tracking-wider hidden md:block">{desc}</span>}
        </div>
      </div>
      <div className="px-4 py-2 bg-black/10 border-b border-white/[0.02]">
        <code className="font-mono text-[8px] text-white/25 break-all leading-relaxed block">{classes}</code>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Section({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  return (
    <div className="mb-12 last:mb-0">
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/[0.04]">
        <span className="font-display text-lg uppercase tracking-tighter text-white">{title}</span>
        {badge && <span className="font-mono text-[7px] tracking-widest text-white/20 px-2 py-0.5 border border-white/[0.06] rounded-sm">{badge}</span>}
      </div>
      {children}
    </div>
  );
}

type Tab = "theme" | "colors" | "typography" | "layout" | "ui" | "motion";

const TABS: { id: Tab; label: string; count?: number }[] = [
  { id: "theme", label: "@theme" },
  { id: "colors", label: "Colors", count: 8 },
  { id: "typography", label: "Typography", count: 8 },
  { id: "layout", label: "Layout", count: 8 },
  { id: "ui", label: "UI", count: 6 },
  { id: "motion", label: "Motion", count: 7 },
];

// ─── Simple Slider ────────────────────────────────────────────────────────────

function Slider({ label, value, min, max, step, onChange, suffix }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; suffix?: string;
}) {
  const pct = Math.round(((value - min) / (max - min)) * 100);
  return (
    <label className="flex items-center gap-2 group cursor-pointer min-w-0">
      <span className="font-mono text-[7px] tracking-widest uppercase text-white/30 w-10 shrink-0 group-hover:text-white/50 transition-colors">{label}</span>
      <div className="relative flex-1 h-5 flex items-center min-w-[60px]">
        <div className="absolute inset-x-0 h-px bg-white/8" />
        <div className="absolute h-px bg-tech-blue" style={{ width: `${pct}%`, left: 0 }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-tech-blue
            [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(0,41,255,0.3)]
            [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-tech-blue" />
      </div>
      <span className="font-mono text-[7px] text-white/45 w-12 text-right tabular-nums shrink-0">{value}{suffix || ""}</span>
    </label>
  );
}

// ─── Rotary Dial Knob ────────────────────────────────────────────────────────

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const sRad = ((startDeg - 90) * Math.PI) / 180;
  const eRad = ((startDeg - 90 + endDeg) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(sRad), y1 = cy + r * Math.sin(sRad);
  const x2 = cx + r * Math.cos(eRad), y2 = cy + r * Math.sin(eRad);
  const large = endDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

function DialKnob({ label, value, min, max, step, onChange, suffix, size = 48 }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; suffix?: string; size?: number;
}) {
  const range = max - min;
  const angleRange = 270; // degrees of rotation
  const startAngle = -135;
  const pct = (value - min) / range;
  const angle = pct * angleRange;
  const cx = size / 2, cy = size / 2, r = size / 2 - 7;
  const rad = ((startAngle + angle) * Math.PI) / 180;
  const tipX = cx + r * Math.cos(rad);
  const tipY = cy + r * Math.sin(rad);
  // Tick marks
  const ticks = Array.from({ length: 11 }).map((_, i) => {
    const a = ((startAngle + (i / 10) * angleRange) * Math.PI) / 180;
    const outer = size / 2 - 2, inner = i % 5 === 0 ? size / 2 - 6 : size / 2 - 4;
    return { x1: cx + inner * Math.cos(a), y1: cy + inner * Math.sin(a), x2: cx + outer * Math.cos(a), y2: cy + outer * Math.sin(a), major: i % 5 === 0 };
  });

  const handlePointer = useCallback((e: React.PointerEvent) => {
    const el = e.currentTarget.getBoundingClientRect();
    const ctrX = el.left + el.width / 2, ctrY = el.top + el.height / 2;
    const onMove = (ev: PointerEvent) => {
      const a = Math.atan2(ev.clientY - ctrY, ev.clientX - ctrX) * (180 / Math.PI);
      let norm = (a - startAngle) / angleRange;
      norm = Math.max(0, Math.min(1, norm));
      const stepped = Math.round((min + norm * range) / step) * step;
      onChange(Math.min(max, Math.max(min, stepped)));
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", () => window.removeEventListener("pointermove", onMove), { once: true });
  }, [min, max, step, range, onChange]);

  return (
    <div className="flex flex-col items-center gap-1.5 select-none">
      <svg width={size} height={size} className="cursor-grab active:cursor-grabbing drop-shadow-[0_0_8px_rgba(0,41,255,0.15)]" onPointerDown={handlePointer}>
        {/* Background arc track */}
        <path d={describeArc(cx, cy, r, startAngle, angleRange)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={2} />
        {/* Active arc */}
        {angle > 0 && <path d={describeArc(cx, cy, r, startAngle, angle)} fill="none" stroke="#0029ff" strokeWidth={2.5} strokeLinecap="round" />}
        {/* Tick marks */}
        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke={i <= Math.round(pct * 10) ? "rgba(0,41,255,0.6)" : "rgba(255,255,255,0.12)"}
            strokeWidth={t.major ? 1.5 : 0.8} />
        ))}
        {/* Needle */}
        <line x1={cx} y1={cy} x2={tipX} y2={tipY} stroke="#0029ff" strokeWidth={2} strokeLinecap="round" />
        {/* Center dot */}
        <circle cx={cx} cy={cy} r={2.5} fill="rgba(255,255,255,0.4)" />
        <circle cx={cx} cy={cy} r={1} fill="#0029ff" />
      </svg>
      {label && <span className="font-mono text-[7px] tracking-widest uppercase text-white/30">{label}</span>}
      <span className="font-mono text-[9px] text-white/60 tabular-nums tracking-tight">{value}{suffix || ""}</span>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function DesignSystemVisualizer() {
  const [activeTab, setActiveTab] = useState<Tab>("theme");
  const [editable, setEditable] = useState<EditableState>(DEFAULT_EDITABLE);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
  const [animateMotion, setAnimateMotion] = useState<string | null>(null);
  const initialVars = useRef<EditableState | null>(null);

  const updateColor = useCallback((k: keyof EditableState["colors"], v: string) => {
    setEditable(p => ({ ...p, colors: { ...p.colors, [k]: v } }));
  }, []);
  const updateSpacing = useCallback((k: keyof EditableState["spacing"], v: number) => {
    setEditable(p => ({ ...p, spacing: { ...p.spacing, [k]: v } }));
  }, []);
  const updateMotion = useCallback((k: "ease" | "easeSharp", f: "cx1" | "cy1" | "cx2" | "cy2", v: number) => {
    setEditable(p => ({ ...p, motion: { ...p.motion, [k]: { ...p.motion[k], [f]: v } } }));
  }, []);
  const updateTypeSize = useCallback((key: string, bp: keyof import("./tokens").BreakpointSizes, value: number) => {
    setEditable(p => ({ ...p, typography: { ...p.typography, [key]: { ...p.typography[key], sizes: { ...p.typography[key].sizes, [bp]: value } } } }));
  }, []);
  const updateTypeParam = useCallback((key: string, field: "tracking" | "weight" | "leading" | "opacity", value: number) => {
    setEditable(p => ({ ...p, typography: { ...p.typography, [key]: { ...p.typography[key], [field]: value } } }));
  }, []);

  const handleReset = useCallback(() => {
    if (initialVars.current) setEditable(initialVars.current);
    else setEditable(DEFAULT_EDITABLE);
  }, []);

  // Capture the site's actual CSS variable values on mount
  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    const captured: EditableState = {
      colors: {
        background: root.getPropertyValue("--background").trim() || DEFAULT_EDITABLE.colors.background,
        foreground: root.getPropertyValue("--foreground").trim() || DEFAULT_EDITABLE.colors.foreground,
        primary: root.getPropertyValue("--primary").trim() || DEFAULT_EDITABLE.colors.primary,
        techBlue: root.getPropertyValue("--tech-blue").trim() || DEFAULT_EDITABLE.colors.techBlue,
        borderNeutral: root.getPropertyValue("--border-neutral").trim() || DEFAULT_EDITABLE.colors.borderNeutral,
        surface: root.getPropertyValue("--surface").trim() || DEFAULT_EDITABLE.colors.surface,
      },
      spacing: {
        tight: parseInt(root.getPropertyValue("--spacing-tight")) || DEFAULT_EDITABLE.spacing.tight,
        normal: parseInt(root.getPropertyValue("--spacing-normal")) || DEFAULT_EDITABLE.spacing.normal,
        wide: parseInt(root.getPropertyValue("--spacing-wide")) || DEFAULT_EDITABLE.spacing.wide,
        xl: parseInt(root.getPropertyValue("--spacing-xl")) || DEFAULT_EDITABLE.spacing.xl,
        sectionTop: parseInt(root.getPropertyValue("--spacing-section-top")) || DEFAULT_EDITABLE.spacing.sectionTop,
      },
      motion: { ...DEFAULT_EDITABLE.motion },
      typography: TYPE_KEYS.reduce((acc, k) => ({ ...acc, [k]: { ...DEFAULT_EDITABLE.typography[k] } }), {}),
    };
    initialVars.current = captured;
    setEditable(captured);
  }, []);

  const handleExport = useCallback(() => {
    const content = generateFileContent(editable);
    const blob = new Blob([content], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "designSystem.ts";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 3000);
  }, [editable]);

  useEffect(() => {
    if (!animateMotion) return;
    const t = setTimeout(() => setAnimateMotion(null), 1200);
    return () => clearTimeout(t);
  }, [animateMotion]);

  // ─── @theme live injection (scoped to visualizer only) ────────────────────
  const visRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!visRef.current) return;
    visRef.current.style.setProperty("--preview-bg", editable.colors.background);
    visRef.current.style.setProperty("--preview-fg", editable.colors.foreground);
    visRef.current.style.setProperty("--preview-primary", editable.colors.primary);
    visRef.current.style.setProperty("--preview-tb", editable.colors.techBlue);
    visRef.current.style.setProperty("--preview-bn", editable.colors.borderNeutral);
    visRef.current.style.setProperty("--preview-surface", editable.colors.surface);
  }, [editable]);

  // ─── Token data ───────────────────────────────────────────────────────────

  const colorTokens = useMemo(() => [
    { k: "bg", desc: "Base page background + text", c: DS.colors.bg, render: <div className={`${DS.colors.bg} p-4 text-xs font-mono border border-white/5`}><span className="font-mono text-[9px] text-foreground/40 block mb-1">bg-background text-foreground</span><span className="text-sm">Body content background</span></div> },
    { k: "surface", desc: "Card/panel background", c: DS.colors.surface, render: <div className={`${DS.colors.surface} p-4 border border-white/5`}><span className="font-mono text-[9px] text-foreground/40 block mb-1">bg-surface</span><span className="text-sm text-foreground">Surface panel</span></div> },
    { k: "surfaceGlass", desc: "Glassmorphism panel", c: DS.colors.surfaceGlass, render: <div className={`${DS.colors.surfaceGlass} p-4`}><span className="font-mono text-[9px] text-foreground/60 block mb-1">Glass panel</span><span className="text-sm text-foreground">backdrop-blur-md</span></div> },
    { k: "textMuted", desc: "Secondary/muted text", c: DS.colors.textMuted, render: <span className={`${DS.colors.textMuted} text-sm font-mono p-4 block border border-white/5`}>Muted secondary text at 60% opacity</span> },
    { k: "textDisabled", desc: "Disabled text", c: DS.colors.textDisabled, render: <span className={`${DS.colors.textDisabled} text-sm font-mono p-4 block border border-white/5`}>Disabled / dimmed text at 30% opacity</span> },
    { k: "accent", desc: "Tech-blue accent + border", c: DS.colors.accent, render: <span className={`${DS.colors.accent} text-sm font-mono border px-3 py-1.5 inline-block`}>ACCENT LABEL</span> },
    { k: "borderMuted", desc: "Subtle border", c: DS.colors.borderMuted, render: <div className={`${DS.colors.borderMuted} border p-4`}><span className="text-sm text-foreground font-mono">Muted border at 10% opacity</span></div> },
    { k: "borderHover", desc: "Hover-only border (wrap in .group)", c: DS.colors.borderHover, render: <div className="p-4 border border-white/5"><span className="text-sm text-foreground/50 font-mono">Applied via group-hover — no static preview</span></div> },
  ], []);

  const layoutTokens = useMemo(() => [
    { k: "page", c: DS.layout.page, d: "Page wrapper padding" },
    { k: "detail", c: DS.layout.detail, d: "Detail page padding" },
    { k: "gridSm", c: DS.layout.gridSm, d: "1→2→3 column grid", grid: 3 },
    { k: "gridMd", c: DS.layout.gridMd, d: "12-column editorial grid", grid12: true },
    { k: "listRow", c: DS.layout.listRow, d: "Archive list row" },
    { k: "editorial", c: DS.layout.editorial, d: "12-col editorial split" },
    { k: "mediaCol", c: DS.layout.mediaCol, d: "Left editorial column" },
    { k: "textCol", c: DS.layout.textCol, d: "Right editorial column" },
  ], []);

  const uiTokens = useMemo(() => [
    { k: "card", c: DS.ui.card, render: <div className={`${DS.ui.card} max-w-[220px]`}><div className="h-20 bg-white/[0.05] mb-3 rounded-sm" /><div className="h-2.5 w-3/4 bg-white/[0.08] rounded-sm mb-2" /><div className="h-2 w-1/2 bg-white/[0.04] rounded-sm" /></div> },
    { k: "cardFooter", c: DS.ui.cardFooter, render: <div className={`${DS.ui.cardFooter} max-w-[220px]`}><span className="font-mono text-[9px]">Label</span><span className="text-sm">→</span></div> },
    { k: "img", c: DS.ui.img, render: <div className="w-40 h-24 overflow-hidden border border-white/10"><div className={`${DS.ui.img} bg-gradient-to-br from-tech-blue/30 to-foreground/30`} /></div> },
    { k: "imgFade", c: DS.ui.imgFade, render: <div className="w-40 h-24 overflow-hidden border border-white/10"><div className={`${DS.ui.imgFade} bg-gradient-to-br from-tech-blue/30 to-foreground/30`} /></div> },
    { k: "arrow", c: DS.ui.arrow, render: <span className={`${DS.ui.arrow} inline-block text-2xl text-foreground`}>→</span> },
    { k: "backButton", c: DS.ui.backButton, render: <span className="font-mono text-[8px] text-white/30 block p-4 border border-dashed border-white/10">fixed top-16 left-16 z-50 (positional)</span> },
  ], []);

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div ref={visRef} className="fixed inset-0 z-[9999] text-foreground overflow-hidden flex flex-col" style={{ background: "#050505" }}>
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-6 py-3 border-b border-white/[0.06] text-white" style={{ background: "#080808" }}>
        <div className="flex items-center gap-4">
          <span className="font-display text-base uppercase tracking-tighter text-white">✦ DS</span>
          <span className="font-mono text-[8px] tracking-widest text-white/25 uppercase">Design System · {activeTab}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className={`font-mono text-[8px] tracking-widest uppercase ${saveStatus === "saved" ? "text-green-400" : "text-white/20"}`}>
            {saveStatus === "saved" ? "✓ exported" : ""}
          </span>
          <a href="/" className="font-mono text-[8px] tracking-widest uppercase text-white/25 hover:text-white/60 transition-colors">Exit</a>
        </div>
      </header>

      {/* Tabs */}
      <nav className="shrink-0 flex items-center border-b border-white/[0.03] bg-[#080808] px-6 overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-2.5 font-mono text-[8px] tracking-[0.3em] uppercase transition-colors shrink-0 ${activeTab === tab.id ? "text-white" : "text-white/25 hover:text-white/50"}`}>
            {tab.label}{tab.count !== undefined && <sup className="ml-1 text-[7px] text-white/20">{tab.count}</sup>}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-px bg-tech-blue shadow-[0_0_6px_rgba(0,41,255,0.5)]" />
            )}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main data-lenis-prevent className="flex-1 overflow-y-auto px-6 py-6">
        {/* ─── @THEME ──────────────────────────────────────────────────────── */}
        {activeTab === "theme" && (
          <>
            <Section title="Color Palette" badge="@theme :root">
              <p className="font-mono text-[8px] text-white/20 mb-5 tracking-wide">Edit CSS custom properties. Changes preview below using scoped CSS variables (site is not affected).</p>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                {([
                  ["Background", editable.colors.background, (v: string) => updateColor("background", v)],
                  ["Foreground", editable.colors.foreground, (v: string) => updateColor("foreground", v)],
                  ["Primary", editable.colors.primary, (v: string) => updateColor("primary", v)],
                  ["Tech Blue", editable.colors.techBlue, (v: string) => updateColor("techBlue", v)],
                  ["Border Neutral", editable.colors.borderNeutral, (v: string) => updateColor("borderNeutral", v)],
                  ["Surface", editable.colors.surface, (v: string) => updateColor("surface", v)],
                ] as const).map(([label, value, onChange]) => (
                  <div key={label} className="flex items-center gap-3 p-2.5 bg-white/[0.03] border border-white/[0.06] rounded-sm">
                    <div className="relative w-9 h-9 shrink-0 rounded-sm overflow-hidden border border-white/10">
                      <div className="absolute inset-0 bg-[repeating-conic-gradient(rgba(255,255,255,0.08)_0%_25%,transparent_0%_50%)] bg-[length:6px_6px]" />
                      <div className="absolute inset-0" style={{ background: value }} />
                      <input type="color" value={value.startsWith("rgba") ? rgbaToHex(value) : value}
                        onChange={e => {
                          const alpha = value.startsWith("rgba") ? parseRgbaAlpha(value) : 1;
                          const newVal = value.startsWith("rgba") ? `rgba(${parseInt(e.target.value.slice(1,3), 16)},${parseInt(e.target.value.slice(3,5), 16)},${parseInt(e.target.value.slice(5,7), 16)},${alpha})` : e.target.value;
                          onChange(newVal);
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-[8px] tracking-widest uppercase text-white/35 block">{label}</span>
                      <input type="text" value={value} onChange={e => onChange(e.target.value)}
                        className="font-mono text-[9px] text-white/60 bg-transparent border-b border-white/10 w-full outline-none focus:border-tech-blue transition-colors py-0.5" />
                    </div>
                  </div>
                ))}
              </div>
              {/* Preview panel with scoped variables */}
              <div className="p-6 border border-white/[0.06] rounded-sm" style={{ background: "var(--preview-bg)", color: "var(--preview-fg)" }}>
                <span className="font-mono text-[8px] tracking-widest uppercase block mb-4" style={{ color: "var(--preview-tb)" }}>Preview</span>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="w-16 h-16 border flex items-center justify-center font-mono text-[8px]" style={{ background: "var(--preview-surface)", color: "var(--preview-fg)", borderColor: "var(--preview-bn)" }}>Surface</div>
                  <div className="w-16 h-16 flex items-center justify-center font-mono text-[8px] font-bold" style={{ background: "var(--preview-tb)", color: "var(--preview-bg)" }}>TB</div>
                  <div className="w-16 h-16 border flex items-center justify-center font-mono text-[8px]" style={{ borderColor: "var(--preview-bn)", color: "var(--preview-fg)" }}>Border</div>
                  <div className="w-16 h-16 flex items-center justify-center font-mono text-[8px]" style={{ background: "var(--preview-primary)", color: "var(--preview-bg)" }}>Primary</div>
                </div>
                <div className="mt-4 border backdrop-blur-md p-3 font-mono text-[9px]" style={{ background: "var(--preview-surface)", borderColor: "var(--preview-bn)", color: "var(--preview-fg)" }}>
                  Glass panel with backdrop-blur
                </div>
              </div>
            </Section>

            <Section title="Spacing Scale" badge="@theme">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4 p-4 border border-white/[0.06] rounded-sm bg-white/[0.015]">
                  <div className="flex flex-wrap items-start gap-5">
                    <DialKnob label="tight" value={editable.spacing.tight} min={0} max={80} step={2} onChange={v => updateSpacing("tight", v)} suffix="px" size={52} />
                    <DialKnob label="normal" value={editable.spacing.normal} min={0} max={120} step={4} onChange={v => updateSpacing("normal", v)} suffix="px" size={52} />
                    <DialKnob label="wide" value={editable.spacing.wide} min={0} max={240} step={8} onChange={v => updateSpacing("wide", v)} suffix="px" size={52} />
                    <DialKnob label="xl" value={editable.spacing.xl} min={0} max={320} step={8} onChange={v => updateSpacing("xl", v)} suffix="px" size={52} />
                    <DialKnob label="sectionTop" value={editable.spacing.sectionTop} min={0} max={200} step={8} onChange={v => updateSpacing("sectionTop", v)} suffix="px" size={52} />
                  </div>
                </div>
                <div className="flex flex-col gap-2 justify-center p-4 border border-white/[0.06] rounded-sm bg-white/[0.015]">
                  {(Object.entries(editable.spacing) as [string, number][]).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-3">
                      <span className="font-mono text-[7px] tracking-widest text-white/25 w-20 uppercase">{k}</span>
                      <div className="h-2.5 bg-tech-blue/30 shrink-0 rounded-sm" style={{ width: `${Math.min(v, 240)}px` }} />
                      <span className="font-mono text-[8px] text-white/40 tabular-nums">{v}px</span>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            <Section title="Font Families" badge="@theme">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: "Sans", value: "Inter", var: "--font-sans", weights: "300–700" },
                  { name: "Display", value: "Plus Jakarta Sans", var: "--font-display", weights: "400–800" },
                  { name: "Mono", value: "JetBrains Mono", var: "--font-mono", weights: "400–500" },
                ].map(f => (
                  <div key={f.name} className="p-4 border border-white/[0.06] rounded-sm bg-white/[0.015]">
                    <span className="font-mono text-[8px] tracking-widest uppercase text-tech-blue block mb-2">{f.name}</span>
                    <span className="text-lg block" style={{ fontFamily: `"${f.value}", sans-serif` }}>{f.value}</span>
                    <span className="font-mono text-[7px] text-white/20 mt-1 block">{f.var} · {f.weights}</span>
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}

        {/* ─── COLORS ──────────────────────────────────────────────────────── */}
        {activeTab === "colors" && (
          <Section title="Color Tokens" badge={`export const colors`}>
            <p className="font-mono text-[8px] text-white/20 mb-5 tracking-wide">Named Tailwind class strings for reusable color contexts.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {colorTokens.map(tk => (
                <TokenCard key={tk.k} label={tk.k} desc={tk.desc} classes={tk.c}>
                  {tk.render}
                </TokenCard>
              ))}
            </div>
          </Section>
        )}

        {/* ─── TYPOGRAPHY ──────────────────────────────────────────────────── */}
        {activeTab === "typography" && (
          <Section title="Typography Scale" badge={`export const t`}>
            <p className="font-mono text-[8px] text-white/20 mb-5 tracking-wide">
              8 hierarchy levels with responsive breakpoint sizes (base → md → lg → 3xl → 4xl).<br />
              Adjust per-breakpoint font sizes via inline inputs, tweak shared params with sliders.
            </p>
            <div className="space-y-3">
              {TYPE_KEYS.map(k => {
                const p = editable.typography[k];
                const s = p.sizes;
                const sample = k === "body" ? "Prose, descriptions, and supporting text that forms the main content of the page." :
                  k === "meta" ? "TAGS · TIMESTAMPS · DATA" :
                  k === "h3" || k === "subtitle" ? "SECTION INDICATORS" :
                  k === "h2" ? "Card Titles & Sub-headers" :
                  k === "h1" ? "Primary Content" :
                  k === "display" ? "Section Headers" :
                  "The quick brown fox";
                const fontFamily = k === "subtitle" || k === "meta" ? "JetBrains Mono, monospace" : "'Plus Jakarta Sans', sans-serif";
                return (
                  <TokenCard key={k} label={k} classes={typeClass(k, p)}>
                    <div style={{
                      fontSize: `${s.base}rem`,
                      fontWeight: p.weight,
                      letterSpacing: `${p.tracking}em`,
                      lineHeight: p.leading,
                      opacity: p.opacity,
                      fontFamily,
                    }} className="uppercase">{sample}</div>

                    {/* Breakpoint sizes */}
                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-white/[0.04]">
                      <span className="font-mono text-[7px] tracking-widest text-white/25 w-8 shrink-0">size</span>
                      {(["base", "md", "lg", "xl3", "xl4"] as const).map(bp => (
                        <label key={bp} className="flex items-center gap-1">
                          <span className="font-mono text-[6px] tracking-widest text-white/20 w-6">{bp}</span>
                          <input type="number" min={0.25} max={20} step={0.125} value={s[bp]}
                            onChange={e => updateTypeSize(k, bp, Math.max(0.25, parseFloat(e.target.value) || 0))}
                            className="w-14 bg-black/40 border border-white/10 rounded-sm px-1.5 py-1 font-mono text-[9px] text-white/70 outline-none focus:border-tech-blue transition-colors" />
                          <span className="font-mono text-[6px] text-white/20">rem</span>
                        </label>
                      ))}
                    </div>

                    {/* Shared parameters */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 pt-2 border-t border-white/[0.04]">
                      <Slider label="track" value={p.tracking} min={-0.05} max={0.5} step={0.005} onChange={v => updateTypeParam(k, "tracking", v)} suffix="em" />
                      <Slider label="weight" value={p.weight} min={100} max={900} step={100} onChange={v => updateTypeParam(k, "weight", v)} />
                      <Slider label="leading" value={p.leading} min={0.5} max={2.5} step={0.05} onChange={v => updateTypeParam(k, "leading", v)} />
                      <Slider label="opacity" value={p.opacity} min={0.05} max={1} step={0.05} onChange={v => updateTypeParam(k, "opacity", v)} />
                    </div>
                  </TokenCard>
                );
              })}
            </div>
          </Section>
        )}

        {/* ─── LAYOUT ──────────────────────────────────────────────────────── */}
        {activeTab === "layout" && (
          <Section title="Layout Tokens" badge={`export const layout`}>
            <p className="font-mono text-[8px] text-white/20 mb-5 tracking-wide">Grid containers, column helpers, and page padding presets.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {layoutTokens.map(tk => (
                <TokenCard key={tk.k} label={tk.k} desc={tk.d} classes={tk.c}>
                  {"grid" in tk && !("grid12" in tk) && (
                    <div className={`${tk.c} mt-1`}>
                      {[1, 2, 3].map(i => <div key={i} className="h-8 bg-white/[0.05] border border-white/[0.06] rounded-sm flex items-center justify-center font-mono text-[7px] text-white/25">{i}</div>)}
                    </div>
                  )}
                  {"grid12" in tk && (
                    <div className={`${tk.c} mt-1`}>
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="h-5 bg-tech-blue/10 border border-tech-blue/10 flex items-center justify-center font-mono text-[6px] text-tech-blue/40">{i + 1}</div>
                      ))}
                    </div>
                  )}
                  {!("grid" in tk) && !("grid12" in tk) && tk.k === "editorial" && (
                    <div className={`${tk.c} mt-1`}>
                      <div className="col-span-4 col-start-2 h-10 bg-white/[0.04] border border-white/[0.06] flex items-center justify-center font-mono text-[7px] text-white/20">media (4/12)</div>
                      <div className="col-span-4 col-start-8 h-10 bg-white/[0.04] border border-white/[0.06] flex items-center justify-center font-mono text-[7px] text-white/20">text (4/12)</div>
                    </div>
                  )}
                  {!("grid" in tk) && !("grid12" in tk) && tk.k !== "editorial" && (
                    <div className="mt-1 p-3 border border-dashed border-white/[0.06] rounded-sm">
                      <span className="font-mono text-[7px] text-white/20">Responsive padding / positioning class set</span>
                    </div>
                  )}
                </TokenCard>
              ))}
            </div>
          </Section>
        )}

        {/* ─── UI ──────────────────────────────────────────────────────────── */}
        {activeTab === "ui" && (
          <Section title="UI Element Tokens" badge={`export const ui`}>
            <p className="font-mono text-[8px] text-white/20 mb-5 tracking-wide">Component-level class presets for cards, images, and interactive elements.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {uiTokens.map(tk => (
                <TokenCard key={tk.k} label={tk.k} classes={tk.c}>
                  {tk.render}
                </TokenCard>
              ))}
            </div>
          </Section>
        )}

        {/* ─── MOTION ──────────────────────────────────────────────────────── */}
        {activeTab === "motion" && (
          <Section title="Motion System" badge={`export const fx · motion`}>
            <p className="font-mono text-[8px] text-white/20 mb-5 tracking-wide">Easing curves, hover transforms, and Framer Motion animation presets.</p>

            <div className="mb-6">
              <span className="font-mono text-[8px] tracking-widest uppercase text-white/30 mb-3 block">Cubic-bezier Curves</span>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {(["ease", "easeSharp"] as const).map(key => {
                  const c = editable.motion[key];
                  return (
                    <div key={key} className="p-4 border border-white/[0.06] rounded-sm bg-white/[0.015]">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-[10px] font-bold tracking-wider text-tech-blue">{key}</span>
                        <span className="font-mono text-[7px] text-white/20">[{c.cx1}, {c.cy1}, {c.cx2}, {c.cy2}]</span>
                      </div>
                      <div className="flex flex-wrap items-start justify-center gap-4 mb-4">
                        {(["cx1", "cy1", "cx2", "cy2"] as const).map(f => (
                          <DialKnob key={f} label={f} value={c[f]} min={0} max={2} step={0.01}
                            onChange={v => updateMotion(key, f, v)} size={44} />
                        ))}
                      </div>
                      <button onClick={() => setAnimateMotion(key)}
                        className="px-3 py-1.5 bg-tech-blue text-background font-mono text-[7px] tracking-widest uppercase hover:brightness-110 transition-all">
                        ▶ Test
                      </button>
                      <div className="mt-3 h-1.5 bg-white/[0.04] rounded-sm overflow-hidden">
                        <div className={`h-full bg-tech-blue/60 rounded-sm ${animateMotion === key ? "w-full" : "w-0"}`}
                          style={{ transitionTimingFunction: `cubic-bezier(${c.cx1},${c.cy1},${c.cx2},${c.cy2})`, transitionDuration: "800ms" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <span className="font-mono text-[8px] tracking-widest uppercase text-white/30 mb-3 block">Hover Transform</span>
              <TokenCard label="skewHover" classes={DS.motion.skewHover}>
                <div className="group inline-block">
                  <span className={`${DS.motion.skewHover} text-sm font-mono text-foreground inline-block`}>Hover over me → skews -10deg</span>
                </div>
              </TokenCard>
            </div>

            <div>
              <span className="font-mono text-[8px] tracking-widest uppercase text-white/30 mb-3 block">Animation Presets</span>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {[
                  { k: "slideIn", label: "slideIn(index)", d: "Staggered blur + slide" },
                  { k: "headerSlideIn", label: "headerSlideIn", d: "Entrance, no delay" },
                  { k: "fade", label: "fade", d: "Opacity 0→1" },
                  { k: "scaleIn", label: "scaleIn", d: "Scale 0.98→1 + fade" },
                ].map(p => (
                  <TokenCard key={p.k} label={p.label} classes={p.k === "slideIn" ? clsDisplay(JSON.stringify(DS.fx.slideIn())) : clsDisplay(JSON.stringify((DS.fx as any)[p.k]))}>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[8px] text-white/30">{p.d}</span>
                      <button onClick={() => setAnimateMotion(p.k)}
                        className="px-3 py-1.5 border border-white/20 font-mono text-[7px] tracking-widest uppercase text-white/40 hover:text-white transition-colors">
                        ▶ Play
                      </button>
                    </div>
                    <div className="mt-3 flex gap-2 min-h-[40px] items-end">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-10 h-10 bg-tech-blue/20 border border-tech-blue/30 rounded-sm flex items-center justify-center font-mono text-[9px] text-tech-blue"
                          style={{
                            opacity: animateMotion === p.k ? 1 : 0,
                            transform: animateMotion === p.k ? "translateX(0)" : "translateX(20px)",
                            filter: animateMotion === p.k ? "blur(0px)" : "blur(4px)",
                            transition: `all 600ms cubic-bezier(${editable.motion.ease.cx1},${editable.motion.ease.cy1},${editable.motion.ease.cx2},${editable.motion.ease.cy2}) ${0.05 + i * 0.05}s`,
                          }}>
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </TokenCard>
                ))}
              </div>
            </div>
          </Section>
        )}
      </main>

      {/* Footer */}
      <footer className="shrink-0 flex items-center justify-between px-6 py-3 border-t border-white/[0.06] bg-[#080808]">
        <button onClick={handleReset}
          className="px-4 py-2 border border-white/10 font-mono text-[8px] tracking-widest uppercase text-white/35 hover:text-white hover:border-white/25 transition-all">
          Reset @theme to defaults
        </button>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[7px] text-white/15">Previews use actual DS.* Tailwind classes</span>
          <button onClick={handleExport}
            className="px-6 py-2.5 bg-tech-blue text-background font-mono text-[8px] tracking-widest uppercase font-bold hover:brightness-110 transition-all">
            Export & Download ↓
          </button>
        </div>
      </footer>

      {/* Toast */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 pointer-events-none z-10">
        <div className={`px-5 py-2.5 bg-tech-blue/10 border border-tech-blue/20 backdrop-blur-xl font-mono text-[8px] tracking-widest text-tech-blue transition-all duration-500 ${
          saveStatus === "saved" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}>
          ✓ designSystem.ts exported
        </div>
      </div>
    </div>
  );
}
