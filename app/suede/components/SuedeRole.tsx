const ROLE_STATS = [
  { value: '10+', label: 'events' },
  { value: '15+', label: 'industry partners' },
  { value: '2', label: 'years' },
  { value: '150', label: 'participants (Designathon)' },
] as const;

export default function SuedeRole() {
  return (
    <section className="suede-role" aria-label="Role progression and impact">
      <div className="suede-role__inner default-container w-container">
        <div className="suede-role__progression" aria-label="Career progression at SUEDE">
          <div className="suede-role__badge suede-role__badge--earlier">
            <span className="suede-role__badge-title">Industry Events Subcommittee</span>
            <span className="suede-role__badge-period">2024</span>
          </div>

          <span className="suede-role__connector" aria-hidden="true">
            <span className="suede-role__connector-h">→</span>
            <span className="suede-role__connector-v">↓</span>
          </span>

          <div className="suede-role__badge suede-role__badge--current">
            <span className="suede-role__badge-title">Industry Events Director</span>
            <span className="suede-role__badge-period">2024–2025</span>
          </div>
        </div>

        <p className="suede-role__description">
          I started on the industry events subcommittee handling outreach and logistics, then moved into
          a leadership role where I was shaping event concepts, managing industry partnerships, and
          coordinating teams of up to 20 people.
        </p>

        <ul className="suede-role__stats">
          {ROLE_STATS.map((stat) => (
            <li key={stat.label} className="suede-role__stat">
              <span className="suede-role__stat-value">{stat.value}</span>
              <span className="suede-role__stat-label">{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
