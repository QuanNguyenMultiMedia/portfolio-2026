// The shape a kit's design system is set in on its System sheet (components/works/System).
export interface KitSystem {
  palette: { group: string; swatches: { name: string; value: string; note?: string }[] }[];
  /** `sample` may mark one word *italic*, as the site's own headings do */
  type: { role: string; family: string; font: string; sample: string; size: string; tracking?: string }[];
  space: { name: string; value: string }[];
  radii: { name: string; value: string; note?: string }[];
}
