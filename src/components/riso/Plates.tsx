// Double-plate lockup (design.md §2 "Register"): the same words printed twice, two inks, off register.
// Server component; the under-plate is aria-hidden so the words are read once.

type Ink = "ink" | "ink-blue" | "ink-violet" | "ink-indigo" | "ink-rose" | "ink-coral";

export default function Plates({
  children,
  over = "ink",
  under,
  className = "",
  hard = false,
  i = 0,
  as: Tag = "span",
}: {
  children: React.ReactNode;
  over?: Ink;
  under?: Ink;
  className?: string;
  hard?: boolean;
  i?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
}) {
  const style = { "--i": i } as React.CSSProperties;
  return (
    <Tag className={`plates ${className}`} data-reg="" style={style}>
      {under ? (
        <span className={`under plate ${under}`} aria-hidden>
          {children}
        </span>
      ) : null}
      <span className={`over plate ${over}${hard ? " hard" : ""}`}>{children}</span>
    </Tag>
  );
}
