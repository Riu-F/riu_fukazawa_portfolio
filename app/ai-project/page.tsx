import './ai-project.css';
import AiNav            from './components/AiNav';
import ScrollAnimations from './components/ScrollAnimations';
import AiCheckoutHero        from './components/AiCheckoutHero';
import AiIdea           from './components/AiIdea';
import AiProcess              from './components/AiProcess';
import AiProblem        from './components/AiProblem';
import AiResearchCompetitors from './components/AiResearchCompetitors';
import AiGoal           from './components/AiGoal';
import AiHowItWorks     from './components/AiHowItWorks';
import AiOutcome        from './components/AiOutcome';
import AiCheckoutGenerator   from './components/AiCheckoutGenerator';
import AiWhatsNext      from './components/AiWhatsNext';
import SiteFooter       from '../components/SiteFooter';

export const metadata = {
  title: 'AI × Design — Riu',
  description: 'How AI can dynamically personalise the post-purchase experience on travel platforms.',
};

export default function AiProjectPage() {
  return (
    <div className="aip">
      <ScrollAnimations />
      <AiNav current="ai-project" />
      <AiCheckoutHero />
      <AiIdea />
      <AiProcess />
      <AiProblem />
      <AiResearchCompetitors />
      <AiGoal />
      <AiHowItWorks />
      <AiOutcome />
      <AiCheckoutGenerator />
      <AiWhatsNext />
      <SiteFooter />
    </div>
  );
}
