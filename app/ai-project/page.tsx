import './ai-project.css';
import AiNav            from './components/AiNav';
import AiHero           from './components/AiHero';
import ScrollAnimations from './components/ScrollAnimations';
import AiIdea           from './components/AiIdea';
import AiContext        from './components/AiContext';
import AiProblem        from './components/AiProblem';
import AiCompetitor     from './components/AiCompetitor';
import AiGoal           from './components/AiGoal';
import AiOutcome        from './components/AiOutcome';
import AiHowItWorks     from './components/AiHowItWorks';
import AiProduct        from './components/AiProduct';
import AiProcess        from './components/AiProcess';
import AiFooter         from './components/AiFooter';

export const metadata = {
  title: 'AI × Design — Riu',
  description: 'How AI can dynamically personalise the post-purchase experience on travel platforms.',
};

export default function AiProjectPage() {
  return (
    <div className="aip">
      <ScrollAnimations />
      <AiNav current="ai-project" />
      <AiHero />
      <AiIdea />
      <AiContext />
      <AiProblem />
      <AiCompetitor />
      <AiProduct />
      <AiGoal />
      <AiOutcome />
      <AiHowItWorks />
      <AiProcess />
      <AiFooter />
    </div>
  );
}
