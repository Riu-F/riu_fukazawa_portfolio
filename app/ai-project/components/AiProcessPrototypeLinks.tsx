const LINK_CARDS = [
  {
    title: 'Slide Deck',
    href: 'https://www.figma.com/proto/CSquBVgWMu5arEto9KXHbg/Visual-Report?node-id=0-1&t=2PJaHZ0rkJ6AofgL-1',
    image: '/Ai-Design/project-evolution/building-prototype/figma.png',
  },
  {
    title: 'Wordware Project',
    href: 'https://app.wordware.ai/explore/apps/d46b28f1-2b84-4276-ac17-b0d352c197ad',
    image: '/Ai-Design/project-evolution/building-prototype/wordware.png',
  },
  {
    title: 'GitHub Code',
    href: 'https://github.com/loganbondoc/DECO3000',
    image: '/Ai-Design/project-evolution/building-prototype/github.png',
  },
] as const;

export default function AiProcessPrototypeLinks() {
  return (
    <div className="aip-process__link-cards">
      {LINK_CARDS.map((card) => (
        <a
          key={card.title}
          href={card.href}
          target="_blank"
          rel="noopener noreferrer"
          className="aip-process__link-card"
        >
          <span className="aip-process__link-card-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={card.image} alt="" loading="lazy" className="aip-process__link-card-img" />
          </span>
          <span className="aip-process__link-card-title">{card.title}</span>
        </a>
      ))}
    </div>
  );
}