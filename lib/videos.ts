/**
 * Maison Murano's own videos on Pablo Murano's YouTube channel
 * (youtube.com/@Pablomurano). All confirmed embeddable via oEmbed.
 */

// Vertical product Shorts, looped muted behind the hero (TIER CLUB's three clips).
export const HERO_SHORTS = [
  { id: "BUzj3r8vuoo", title: "Próximo drop" },
  { id: "UDIVu4R8Ens", title: "Whos up? — Maison Murano" },
  { id: "-P8138pFGgI", title: "maisonmurano.es" },
];

// Long-form vlogs: the story of building the brand.
export const VLOGS = [
  { id: "V7pWUMFPTLE", title: "Por esto decidí crear mi marca de ropa", duration: "5:11" },
  { id: "Ssc7NH0uCJA", title: "Semana en la vida del dueño de una marca de ropa emergente", duration: "21:56" },
  { id: "N4rZDXc0cuU", title: "Mi primer Scrapworld con mi marca de ropa", duration: "22:06" },
];

export const CHANNEL_URL = "https://www.youtube.com/@Pablomurano";

export function embedUrl(id: string, background = false) {
  const p = new URLSearchParams(
    background
      ? { autoplay: "1", mute: "1", loop: "1", playlist: id, controls: "0", playsinline: "1", rel: "0", modestbranding: "1", iv_load_policy: "3", disablekb: "1" }
      : { autoplay: "1", rel: "0", modestbranding: "1", playsinline: "1" }
  );
  return `https://www.youtube-nocookie.com/embed/${id}?${p.toString()}`;
}

export const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
