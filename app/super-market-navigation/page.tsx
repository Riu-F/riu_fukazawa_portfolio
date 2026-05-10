import '../ai-project/ai-project.css';
import './supermarket.css';
import ScrollAnimations from '../ai-project/components/ScrollAnimations';
import ScrollToTopOnMount from './components/ScrollToTopOnMount';
import AiNav from '../ai-project/components/AiNav';
import SupermarketFoodHubHero from './components/SupermarketFoodHubHero';
import SupermarketContext from './components/SupermarketContext';
import SupermarketResearchLandscape from './components/SupermarketResearchLandscape';
import SupermarketPrimaryResearch from './components/SupermarketPrimaryResearch';
import SupermarketAffinityDiagramming from './components/SupermarketAffinityDiagramming';
import SupermarketInsights from './components/SupermarketInsights';
import SupermarketIdeation from './components/SupermarketIdeation';
import SupermarketDesignConcept from './components/SupermarketDesignConcept';
import SupermarketPrototyping from './components/SupermarketPrototyping';
import SupermarketUserTesting from './components/SupermarketUserTesting';
import SupermarketEvaluation from './components/SupermarketEvaluation';
import SupermarketFeasibilityRoadmap from './components/SupermarketFeasibilityRoadmap';
import SupermarketCaseStudyClosing from './components/SupermarketCaseStudyClosing';
import SupermarketFooter from './components/SupermarketFooter';

export const metadata = {
  title: 'Supermarket Navigation — Riu',
  description:
    'How to assist people with cognitive disabilities access a supermarket, which most people take for granted.',
};

export default function SuperMarketNavigationPage() {
  return (
    <div className="aip smp">
      <ScrollToTopOnMount />
      <ScrollAnimations />
      <AiNav current="supermarket" />
      <SupermarketFoodHubHero />
      <SupermarketContext />
      <SupermarketResearchLandscape />
      <SupermarketPrimaryResearch />
      <SupermarketAffinityDiagramming />
      <SupermarketInsights />
      <SupermarketIdeation />
      <SupermarketDesignConcept />
      <SupermarketPrototyping />
      <SupermarketUserTesting />
      <SupermarketEvaluation />
      <SupermarketFeasibilityRoadmap />
      <SupermarketCaseStudyClosing />
      <SupermarketFooter />
    </div>
  );
}
