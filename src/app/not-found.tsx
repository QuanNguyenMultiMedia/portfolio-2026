import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-8">
      <div className="max-w-md text-center space-y-8">
        <div className="font-mono text-[9px] tracking-[0.4em] uppercase opacity-40">
          ERROR // 404
        </div>
        <h1 className="font-display text-6xl md:text-8xl font-bold uppercase tracking-tighter leading-none">
          Not Found
        </h1>
        <p className="font-sans text-base font-light text-foreground/60 leading-relaxed">
          This page does not exist. The link may be broken, or the page may have been moved.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-block border border-primary px-8 py-4 font-mono text-[10px] tracking-[0.4em] uppercase hover:bg-foreground hover:text-background transition-all duration-300"
          >
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
