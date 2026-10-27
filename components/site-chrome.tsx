import Link from "next/link";

const textLinkClass =
  "text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-5xl px-4 ${className}`}>{children}</div>;
}

export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <Container className="flex items-center justify-between gap-4 py-4">
        <Link
          href="/"
          className="font-display text-lg font-extrabold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          Hackney Wick Directory
        </Link>
        <nav aria-label="Site" className="flex shrink-0 items-center gap-4 text-sm font-medium">
          <Link href="/guides" className={textLinkClass}>
            Guides
          </Link>
          <Link href="/advertise" className={textLinkClass}>
            Advertise
          </Link>
        </nav>
      </Container>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <Container className="py-6 text-sm">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            <li>
              <Link href="/about" className={textLinkClass}>
                About
              </Link>
            </li>
            <li>
              <Link href="/advertise" className={textLinkClass}>
                Advertise
              </Link>
            </li>
            <li>
              <Link href="/privacy" className={textLinkClass}>
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/contact" className={textLinkClass}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <a
          href="https://www.openstreetmap.org/copyright"
          className="mt-3 inline-block text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          Map data © OpenStreetMap contributors
        </a>
      </Container>
    </footer>
  );
}
