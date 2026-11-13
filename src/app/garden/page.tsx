// Server Component: the garden page. The kind filter is a plain link (?kind=), so it filters with no client JS; it
// is handed to the bed (GardenBed, the client leaf) to sit under the name, where the reader lands. The bed is the
// whole screen: one sheet to wander, and the pane and the photo view it opens in place.
import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";
import GardenBed from "@/components/garden/GardenBed";
import { garden, GARDEN_KINDS, isKind } from "@/data/garden";
import { t, motion as motionTokens } from "@/lib/designSystem";

export default async function GardenPage({ searchParams }: { searchParams: Promise<{ kind?: string; open?: string }> }) {
  const { kind, open } = await searchParams;
  const active = isKind(kind) ? kind : null;
  const entries = active ? garden.filter((e) => e.kind === active) : garden;

  return (
    <PageWrapper variant="hero">
      <GardenBed key={active ?? "all"} entries={entries} initialOpen={open ?? null}>
        {/* kind filter: the active one links back to the whole bed */}
        <nav aria-label="Garden" className="flex flex-wrap gap-x-8 gap-y-3">
          {GARDEN_KINDS.map(({ kind: k, label }) => {
            const on = k === active;
            return (
              <Link
                key={k}
                href={on ? "/garden" : `/garden?kind=${k}`}
                scroll={false}
                aria-current={on ? "page" : undefined}
                className={`group ${t.metaDataLabel} transition-opacity duration-300 ${on ? "opacity-100 underline underline-offset-4" : "opacity-50 hover:opacity-100"}`}
              >
                <span className={motionTokens.skewHover}>{label}</span>
              </Link>
            );
          })}
        </nav>
      </GardenBed>
    </PageWrapper>
  );
}
