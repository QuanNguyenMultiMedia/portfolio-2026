import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-8">
      <div className="max-w-md text-center space-y-8">
        <h1 data-blurmap="" style={{ "--i": 0 } as React.CSSProperties} className="rise font-display text-4xl md:text-6xl font-normal tracking-tight leading-none">
          Not Found
        </h1>
        <p style={{ "--i": 1 } as React.CSSProperties} className="rise font-sans text-base font-light text-foreground leading-relaxed">
          This page does not exist. The link may be broken, or the page may have been moved.
        </p>
        <div style={{ "--i": 2 } as React.CSSProperties} className="rise pt-4">
          <Link
            href="/"
            className="inline-block border border-primary px-8 py-4 font-sans text-sm hover:bg-foreground hover:text-background transition-all duration-300"
          >
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
