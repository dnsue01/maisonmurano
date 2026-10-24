import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Wordmark } from "@/components/brand/wordmark";

// lucide removed brand glyphs (trademark); inline all social marks.
function Instagram() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function Youtube() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.7-1.7C19.3 5.2 12 5.2 12 5.2s-7.3 0-8.9.4A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.7 1.7c1.6.4 8.9.4 8.9.4s7.3 0 8.9-.4a2.5 2.5 0 0 0 1.7-1.7C23 15.2 23 12 23 12zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z" />
    </svg>
  );
}
function TikTok() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M16 3c.3 2.1 1.6 3.8 3.7 4.1v2.6c-1.3.1-2.6-.3-3.7-1v5.9c0 3-2.4 5.4-5.4 5.4S5.2 17.6 5.2 14.6 7.6 9.2 10.6 9.2c.3 0 .6 0 .9.1v2.7c-.3-.1-.6-.2-.9-.2-1.5 0-2.7 1.2-2.7 2.8s1.2 2.8 2.7 2.8 2.7-1.2 2.7-2.8V3H16z" />
    </svg>
  );
}
const SOCIALS = [
  { href: "https://www.instagram.com/maisonmurano_/", label: "Instagram", Icon: Instagram },
  { href: "https://www.tiktok.com/@maisonmurano_", label: "TikTok", Icon: TikTok },
  { href: "https://www.youtube.com/@Pablomurano", label: "YouTube", Icon: Youtube },
];

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  const cols = [
    {
      title: t("shop"),
      links: [
        { href: "/productos", label: nav("products") },
        { href: "/nosotros", label: nav("about") },
      ],
    },
    {
      title: t("help"),
      links: [
        { href: "/legal/contacto", label: t("contact") },
        { href: "/legal/envios", label: t("shippingPolicy") },
        { href: "/legal/reembolsos", label: t("refunds") },
      ],
    },
    {
      title: t("legal"),
      links: [
        { href: "/legal/privacidad", label: t("privacy") },
        { href: "/legal/terminos", label: t("terms") },
        { href: "/legal/aviso-legal", label: t("legalNotice") },
      ],
    },
  ];

  return (
    <footer className="border-t border-paper/10 bg-wall text-paper">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Wordmark stacked className="text-6xl text-paper" />
            <p className="font-display mt-3 text-2xl text-flash">A dream in motion</p>
            <div className="mt-6 flex gap-4">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="transition-colors hover:text-mustard"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="font-label mb-4 text-[12px] text-smoke">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-paper/90 transition-colors hover:text-mustard"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-paper/10 pt-6 text-xs text-smoke md:flex-row">
          <p>© {new Date().getFullYear()} Maison Murano. {t("rights")}</p>
          <p>From the room to the world</p>
        </div>

        <p className="mt-4 text-center text-xs text-smoke">
          {t("proposal")}{" "}
          <a
            href="https://dnsue01.github.io/portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-paper/85 underline-offset-4 hover:text-mustard hover:underline"
          >
            Daniel Nsue
          </a>
          {" · "}
          <a
            href="mailto:nsuedawebs@gmail.com"
            className="text-paper/85 underline-offset-4 hover:text-mustard hover:underline"
          >
            nsuedawebs@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
}
