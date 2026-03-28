interface AiNavProps {
  current?: 'home' | 'ai-project';
}

export default function AiNav({ current = 'ai-project' }: AiNavProps) {
  return (
    <nav className="aip-nav-bar">
      <a href="/" className={current === 'home' ? 'current' : ''}>Home</a>
      <div className="nav-divider" />
      <a href="/ai-project" className={current === 'ai-project' ? 'current' : ''}>Ai &times; Design</a>
      <a href="/supermarket">Supermarket Navigation</a>
    </nav>
  );
}
