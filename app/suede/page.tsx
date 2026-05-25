import '../ai-project/ai-project.css';
import './suede.css';
import ScrollAnimations from '../ai-project/components/ScrollAnimations';
import AiNav from '../ai-project/components/AiNav';
import SiteFooter from '../components/SiteFooter';
import SuedeIntro from './components/SuedeIntro';
import SuedeRole from './components/SuedeRole';
import SuedeEvents from './components/SuedeEvents';
import SuedeDesignathon from './components/SuedeDesignathon';
import SuedeClosing from './components/SuedeClosing';

export const metadata = {
  title: 'SUEDE — Riu',
  description:
    'Industry events and design community work with Sydney University Experience Designers.',
};

export default function SuedePage() {
  return (
    <div className="aip suede">
      <ScrollAnimations />
      <AiNav />
      <SuedeIntro />
      <SuedeRole />
      <SuedeEvents />
      <SuedeDesignathon />
      <SuedeClosing />
      <SiteFooter />
    </div>
  );
}
