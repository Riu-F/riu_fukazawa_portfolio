import { ProjectDetailsAccordion } from '../../components/project-page/ProjectDetailsAccordion';
import { InsightTag } from './InsightTag';

export default function SupermarketInsights() {
  return (
    <section className="default-section">
      <div className="default-container w-container">
        <div className="grid---left-flex-horizontal h3-headings" />
        <h2 className="h2">Insights</h2>
        <p className="paragraph-new">We synthesised our user research findings into three key insights.</p>
        <div className="slot---empty">
          <section>
            <div className="grid---flex-collums">
              <div>
                <div className="project---1-3-big-number---div">
                  <div className="big-number">01</div>
                  <div>Insight</div>
                </div>
                <div className="project---2-2-grid---div">
                  <h4 className="h4">🧭 Navigation</h4>
                </div>
                <div className="slot---empty">
                  <div className="insights-sticky-wall" aria-label="Navigation affinity notes">
                    <details className="insights-sticky">
                      <summary className="insights-sticky__summary">
                        <div className="insights-sticky__header">
                          <div className="insights-sticky__title">Difficulty finding items</div>
                          <InsightTag insight="navigation" />
                        </div>
                        <div className="insights-sticky__subtitle">
                          Weird locations, weird categories, confusing layouts
                        </div>
                      </summary>
                      <div className="insights-affinity">
                        <div className="insights-affinity__cluster">
                          <div className="insights-affinity__heading">Layout confusion</div>
                          <div className="insights-affinity__points">
                            <div className="insights-affinity__point">
                              “Products grouped by brand in one store, by category in another”
                            </div>
                            <div className="insights-affinity__point">“Moved items with no indication of where they went”</div>
                            <div className="insights-affinity__point">
                              “Had to walk every aisle just to find pasta sauce”
                            </div>
                          </div>
                        </div>
                        <div className="insights-affinity__cluster">
                          <div className="insights-affinity__heading">Mental mapping</div>
                          <div className="insights-affinity__points">
                            <div className="insights-affinity__point">
                              “I only know where things are because I’ve been coming here for years”
                            </div>
                            <div className="insights-affinity__point">“New stores are basically impossible without help”</div>
                            <div className="insights-affinity__point">“If they rearrange, my whole system breaks”</div>
                          </div>
                        </div>
                      </div>
                    </details>

                    <details className="insights-sticky">
                      <summary className="insights-sticky__summary">
                        <div className="insights-sticky__header">
                          <div className="insights-sticky__title">Signage doesn’t help</div>
                          <InsightTag insight="navigation" />
                        </div>
                        <div className="insights-sticky__subtitle">
                          Hard to read, too broad, sometimes missing entirely
                        </div>
                      </summary>
                      <div className="insights-affinity">
                        <div className="insights-affinity__cluster">
                          <div className="insights-affinity__heading">Signage readability</div>
                          <div className="insights-affinity__points">
                            <div className="insights-affinity__point">
                              “Font is too small to read from the end of the aisle”
                            </div>
                            <div className="insights-affinity__point">
                              “Signs say ‘International Foods’ but that could be anything”
                            </div>
                            <div className="insights-affinity__point">“Some aisles just don’t have signs at all”</div>
                          </div>
                        </div>
                        <div className="insights-affinity__cluster">
                          <div className="insights-affinity__heading">Category mismatch</div>
                          <div className="insights-affinity__points">
                            <div className="insights-affinity__point">
                              “Toothpaste is in ‘Health and Beauty’ not ‘Bathroom’”
                            </div>
                            <div className="insights-affinity__point">
                              “You’re trying to encapsulate a whole aisle in a couple of words”
                            </div>
                            <div className="insights-affinity__point">
                              “I guessed wrong three times before I found it”
                            </div>
                          </div>
                        </div>
                      </div>
                    </details>

                    <details className="insights-sticky">
                      <summary className="insights-sticky__summary">
                        <div className="insights-sticky__header">
                          <div className="insights-sticky__title">No product availability info</div>
                          <InsightTag insight="navigation" />
                        </div>
                        <div className="insights-sticky__subtitle">
                          Empty shelves, unclear substitutes, wasted trips
                        </div>
                      </summary>
                      <div className="insights-affinity">
                        <div className="insights-affinity__cluster">
                          <div className="insights-affinity__heading">Stock uncertainty</div>
                          <div className="insights-affinity__points">
                            <div className="insights-affinity__point">
                              “Went specifically for one item and the shelf was empty”
                            </div>
                            <div className="insights-affinity__point">
                              “No way to know before going whether they have it”
                            </div>
                            <div className="insights-affinity__point">
                              “Staff said ‘try tomorrow’ which doesn’t help me right now”
                            </div>
                          </div>
                        </div>
                        <div className="insights-affinity__cluster">
                          <div className="insights-affinity__heading">Substitution difficulty</div>
                          <div className="insights-affinity__points">
                            <div className="insights-affinity__point">
                              “I don’t know what’s a good alternative if my item isn’t there”
                            </div>
                            <div className="insights-affinity__point">
                              “Decision paralysis kicks in when my plan falls apart”
                            </div>
                          </div>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
              <div>
                <div className="project---1-3-big-number---div">
                  <div className="big-number">02</div>
                  <div>Insight</div>
                </div>
                <div className="project---2-2-grid---div">
                  <h4 className="h4">💬 Communication</h4>
                </div>
                <div className="slot---empty">
                  <div className="insights-sticky-wall" aria-label="Communication affinity notes">
                    <details className="insights-sticky">
                      <summary className="insights-sticky__summary">
                        <div className="insights-sticky__header">
                          <div className="insights-sticky__title">People avoid asking for help</div>
                          <InsightTag insight="communication" />
                        </div>
                        <div className="insights-sticky__subtitle">Social anxiety, bad experiences, guilt</div>
                      </summary>
                      <div className="insights-affinity">
                        <div className="insights-affinity__cluster">
                          <div className="insights-affinity__heading">Emotional barriers</div>
                          <div className="insights-affinity__points">
                            <div className="insights-affinity__point">“I feel like I’m interrupting them”</div>
                            <div className="insights-affinity__point">“I don’t feel confident asking”</div>
                            <div className="insights-affinity__point">“It feels stupid to ask where the bread is”</div>
                          </div>
                        </div>
                        <div className="insights-affinity__cluster">
                          <div className="insights-affinity__heading">Past negative experiences</div>
                          <div className="insights-affinity__points">
                            <div className="insights-affinity__point">
                              “Half the time they just point to an aisle anyway”
                            </div>
                            <div className="insights-affinity__point">
                              “I asked once and the staff member didn’t know either”
                            </div>
                            <div className="insights-affinity__point">“They seemed annoyed, so I stopped asking”</div>
                          </div>
                        </div>
                      </div>
                    </details>

                    <details className="insights-sticky">
                      <summary className="insights-sticky__summary">
                        <div className="insights-sticky__header">
                          <div className="insights-sticky__title">Staff can’t always help anyway</div>
                          <InsightTag insight="communication" />
                        </div>
                        <div className="insights-sticky__subtitle">
                          Hard to find, unsure of answers, inconsistent knowledge
                        </div>
                      </summary>
                      <div className="insights-affinity">
                        <div className="insights-affinity__cluster">
                          <div className="insights-affinity__heading">Availability</div>
                          <div className="insights-affinity__points">
                            <div className="insights-affinity__point">
                              “You can never find someone when you actually need them”
                            </div>
                            <div className="insights-affinity__point">“They’re always stocking shelves or busy”</div>
                          </div>
                        </div>
                        <div className="insights-affinity__cluster">
                          <div className="insights-affinity__heading">Knowledge gaps</div>
                          <div className="insights-affinity__points">
                            <div className="insights-affinity__point">
                              “Staff are often new and don’t know the layout”
                            </div>
                            <div className="insights-affinity__point">“They pointed me to the wrong aisle twice”</div>
                            <div className="insights-affinity__point">
                              “Online picking staff know better than floor staff”
                            </div>
                          </div>
                        </div>
                      </div>
                    </details>

                    <details className="insights-sticky">
                      <summary className="insights-sticky__summary">
                        <div className="insights-sticky__header">
                          <div className="insights-sticky__title">No alternative ways to get assistance</div>
                          <InsightTag insight="communication" />
                        </div>
                        <div className="insights-sticky__subtitle">
                          When staff aren’t the answer, there’s nothing else
                        </div>
                      </summary>
                      <div className="insights-affinity">
                        <div className="insights-affinity__cluster">
                          <div className="insights-affinity__heading">Digital gap</div>
                          <div className="insights-affinity__points">
                            <div className="insights-affinity__point">
                              “The app tells me what’s on sale but not where anything is”
                            </div>
                            <div className="insights-affinity__point">“No search function for in-store location”</div>
                          </div>
                        </div>
                        <div className="insights-affinity__cluster">
                          <div className="insights-affinity__heading">Workarounds</div>
                          <div className="insights-affinity__points">
                            <div className="insights-affinity__point">“I just Google it and hope for the best”</div>
                            <div className="insights-affinity__point">
                              “Sometimes I call ahead to check if they stock something”
                            </div>
                          </div>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
              <div>
                <div className="project---1-3-big-number---div">
                  <div className="big-number">03</div>
                  <div>Insight</div>
                </div>
                <div className="project---2-2-grid---div">
                  <h4 className="h4">🧠 Distraction</h4>
                </div>
                <div className="slot---empty">
                  <div className="insights-sticky-wall" aria-label="Distraction affinity notes">
                    <details className="insights-sticky">
                      <summary className="insights-sticky__summary">
                        <div className="insights-sticky__header">
                          <div className="insights-sticky__title">Overstimulating environments</div>
                          <InsightTag insight="distraction" />
                        </div>
                        <div className="insights-sticky__subtitle">Crowds, lighting, noise, dense shelves</div>
                      </summary>
                      <div className="insights-affinity">
                        <div className="insights-affinity__cluster">
                          <div className="insights-affinity__heading">Sensory overload</div>
                          <div className="insights-affinity__points">
                            <div className="insights-affinity__point">
                              “The fluorescent lights give me headaches after 20 minutes”
                            </div>
                            <div className="insights-affinity__point">
                              “Music plus announcements plus people talking is a lot”
                            </div>
                            <div className="insights-affinity__point">
                              “There’s just a lot going on… it’s more interactive than it needs to be”
                            </div>
                          </div>
                        </div>
                        <div className="insights-affinity__cluster">
                          <div className="insights-affinity__heading">Physical environment</div>
                          <div className="insights-affinity__points">
                            <div className="insights-affinity__point">
                              “Aisles are too narrow when other people are in them”
                            </div>
                            <div className="insights-affinity__point">
                              “Shelves packed floor to ceiling feel claustrophobic”
                            </div>
                          </div>
                        </div>
                      </div>
                    </details>

                    <details className="insights-sticky">
                      <summary className="insights-sticky__summary">
                        <div className="insights-sticky__header">
                          <div className="insights-sticky__title">Decision paralysis</div>
                          <InsightTag insight="distraction" />
                        </div>
                        <div className="insights-sticky__subtitle">
                          Too much choice, hard to compare, fear of wrong pick
                        </div>
                      </summary>
                      <div className="insights-affinity">
                        <div className="insights-affinity__cluster">
                          <div className="insights-affinity__heading">Choice overload</div>
                          <div className="insights-affinity__points">
                            <div className="insights-affinity__point">
                              “There are 40 types of pasta sauce and I can’t tell the difference”
                            </div>
                            <div className="insights-affinity__point">
                              “I could spend an hour comparing things if I don’t have a plan”
                            </div>
                            <div className="insights-affinity__point">
                              “The worry that we might choose the wrong option gives us unwanted stress”
                            </div>
                          </div>
                        </div>
                        <div className="insights-affinity__cluster">
                          <div className="insights-affinity__heading">Label difficulty</div>
                          <div className="insights-affinity__points">
                            <div className="insights-affinity__point">“Nutritional info is tiny and dense”</div>
                            <div className="insights-affinity__point">
                              “Price per unit vs price per item confuses me every time”
                            </div>
                          </div>
                        </div>
                      </div>
                    </details>

                    <details className="insights-sticky">
                      <summary className="insights-sticky__summary">
                        <div className="insights-sticky__header">
                          <div className="insights-sticky__title">Impulse buying</div>
                          <InsightTag insight="distraction" />
                        </div>
                        <div className="insights-sticky__subtitle">
                          Sales, promotions, hunger, unstructured roaming
                        </div>
                      </summary>
                      <div className="insights-affinity">
                        <div className="insights-affinity__cluster">
                          <div className="insights-affinity__heading">Triggers</div>
                          <div className="insights-affinity__points">
                            <div className="insights-affinity__point">
                              “Sale stickers pull my attention even when I don’t need the item”
                            </div>
                            <div className="insights-affinity__point">
                              “Limited edition stuff creates fear of missing out”
                            </div>
                            <div className="insights-affinity__point">“Shopping hungry is a disaster every time”</div>
                          </div>
                        </div>
                        <div className="insights-affinity__cluster">
                          <div className="insights-affinity__heading">Loss of structure</div>
                          <div className="insights-affinity__points">
                            <div className="insights-affinity__point">
                              “If I don’t have a list I just wander and grab things”
                            </div>
                            <div className="insights-affinity__point">
                              “I end up buying stuff I already have at home”
                            </div>
                            <div className="insights-affinity__point">
                              “Getting off track is where the overspending happens”
                            </div>
                          </div>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <blockquote className="paragraph-new">
            Individuals with Cognitive Learning Disabilities, such as Dyslexia, ADHD, and ASD, face
            significant challenges in navigating supermarket environments due to a lack of universally
            accessible design.
          </blockquote>
        </div>
      </div>
    </section>
  );
}
