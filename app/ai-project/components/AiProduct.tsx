'use client';

import { useState } from 'react';
import AICheckoutDemo from '../../components/AICheckoutDemo';

/* ── Persona output content (static) ──────────────────────────── */
function PersonaOutput({ persona }: { persona: 1 | 2 | 3 }) {
  if (persona === 1) return (
    <div style={{ padding: '2rem 2.5rem 3rem', fontFamily: 'Inter, sans-serif' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.01em', marginBottom: '1.5rem' }}>
        Your Tokyo family holiday is confirmed!
      </h2>
      <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#222', marginBottom: '1.8rem' }}>
        Hi Dewi — your Tokyo family holiday is all set! It&rsquo;s your first overseas trip, with
        seven nights in late December coming from Jakarta. Expect crisp winter days, dazzling lights,
        and kid-friendly adventures across theme parks, shopping malls, and relaxed sightseeing.
        Here&rsquo;s a short, practical wrap-up tuned to your plans so you can travel with confidence.
      </p>
      {[
        { heading: 'Smooth arrival and entry', paragraph: 'Most Indonesian passports require a Japanese tourist visa, unless you have an e-passport that\'s been pre-registered for visa-free entry — confirm with the Japanese Embassy in Jakarta and allow time for processing. Before you fly, complete Visit Japan Web to generate immigration and customs QR codes. With kids and luggage, the Airport Limousine Bus is the easiest option from Haneda or Narita to major hotels. Tokyo is two hours ahead of Jakarta, so jet lag is minimal — plan early starts and earlier bedtimes on your first day.' },
        { heading: 'Winter-ready packing and family days out', paragraph: 'Late-December Tokyo is cool and dry, around 3–10°C, with sunset near 4:30 pm. Pack layers (thermal tops, jumpers, warm jacket) plus beanies, gloves, and comfortable walking shoes. For the parks, buy dated tickets in advance via official apps. Cosy, indoor picks for chilly days include Sanrio Puroland, the Sumida Aquarium at Tokyo Skytree, and easy shopping at Ikspiari (Disney Resort) or Odaiba\'s DiverCity.' },
        { heading: 'Getting around, money and easy eats', paragraph: 'Pick up a Suica or PASMO transport card on arrival. Ask station staff to set up child cards for half fares — they can be used for trains, buses, and many shops. For mild, family-friendly meals, try chicken or shoyu ramen, Japanese curry rice, tempura, and gyoza. If you need halal options, the Halal Gourmet Japan app is a reliable guide around Asakusa and Shinjuku.' },
      ].map(s => (
        <div key={s.heading} style={{ padding: '1.75rem 0', borderTop: '1px dotted rgba(0,0,0,0.18)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>{s.heading}</h3>
          <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#222' }}>{s.paragraph}</p>
        </div>
      ))}
      <p style={{ marginTop: '2.5rem', fontWeight: 500, fontSize: '1rem', color: '#222' }}>
        Have a magical week in Tokyo — selamat jalan, Dewi!
      </p>
    </div>
  );

  if (persona === 2) return (
    <div style={{ padding: '2rem 2.5rem 3rem', fontFamily: 'Inter, sans-serif' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.01em', marginBottom: '1.5rem' }}>
        Your Kyoto spring getaway is confirmed, Jordan!
      </h2>
      <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#222', marginBottom: '1.8rem' }}>
        Jordan, your Kyoto spring getaway is locked in. Twelve nights gives you time to wander slow
        — perfect for temple walks, design detours, and third-wave coffee. April brings mild days,
        cool evenings, and the tail-end of cherry blossoms with fresh greens — ideal light for
        photography.
      </p>
      {[
        { heading: 'Touchdown to town, the smooth way', paragraph: 'Flying into Kansai (KIX)? Take the JR Haruka Express straight to Kyoto Station — about 75 minutes. Add an IC transit card (ICOCA, Suica, or PASMO) to your Apple/Google Wallet for tap-on fares across trains, subways, and most buses.' },
        { heading: 'April rhythm: design, light and breathing space', paragraph: 'Beat the crowds by going early: Fushimi Inari before sunrise, Arashiyama\'s bamboo grove before 8 am, Higashiyama lanes on weekday mornings. For coffee precision: Weekenders Coffee, Kurasu Kyoto, % Arabica (Higashiyama/Arashiyama), and Vermillion near Fushimi Inari.' },
        { heading: 'Pack smart, move thoughtfully', paragraph: 'Expect 8–20°C with light showers — pack layers, a compact waterproof, and shoes that handle cobbles and temple stairs. Many temples ban tripods and drones; in Gion\'s private alleys, photography is restricted.' },
      ].map(s => (
        <div key={s.heading} style={{ padding: '1.75rem 0', borderTop: '1px dotted rgba(0,0,0,0.18)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>{s.heading}</h3>
          <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#222' }}>{s.paragraph}</p>
        </div>
      ))}
      <p style={{ marginTop: '2.5rem', fontWeight: 500, fontSize: '1rem', color: '#222' }}>
        Kyoto in spring awaits — have an inspiring trip, Jordan!
      </p>
    </div>
  );

  return (
    <div style={{ padding: '2rem 2.5rem 3rem', fontFamily: 'Inter, sans-serif' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.01em', marginBottom: '1.5rem' }}>
        Your Paris escape is confirmed, Harold &amp; Margaret!
      </h2>
      <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#222', marginBottom: '1.8rem' }}>
        Bonjour Harold and Margaret — your 9-night Paris escape this September is locked in. While
        it&rsquo;s early spring in Melbourne, Paris enjoys mellow late-summer days, ideal for art,
        gardens, and unhurried strolls.
      </p>
      {[
        { heading: 'Arriving with ease', paragraph: 'After the long overnight from Melbourne, the easiest arrival at Paris Charles de Gaulle (CDG) is a pre-booked chauffeur: meet-and-greet at the exit, help with luggage, and a fixed fare to your hotel. Official taxis are also reliable with set fares — about €53 to the Right Bank or €58 to the Left Bank.' },
        { heading: 'Art, gardens and viewpoints — without the queues', paragraph: 'Book timed entries for major museums — especially the Louvre (closed Tuesday), Musée d\'Orsay (closed Monday), and the Orangerie (closed Tuesday). For beautiful, easy walks, visit the Jardin du Luxembourg and the Tuileries.' },
        { heading: 'Dining and daily practicalities, tailored to you', paragraph: 'September is mild — around 12–22°C with the occasional shower. Pack layers, a light rain jacket, and supportive walking shoes. Dining in Paris is reservation-led: book popular bistros or Michelin picks early, and look to lunch tasting menus for excellent value.' },
      ].map(s => (
        <div key={s.heading} style={{ padding: '1.75rem 0', borderTop: '1px dotted rgba(0,0,0,0.18)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>{s.heading}</h3>
          <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#222' }}>{s.paragraph}</p>
        </div>
      ))}
      <p style={{ marginTop: '2.5rem', fontWeight: 500, fontSize: '1rem', color: '#222' }}>
        Bon voyage — Paris is yours to savour, Harold &amp; Margaret!
      </p>
    </div>
  );
}

const TABS = [
  { id: 'prototype', label: 'Prototype', iconType: 'app' },
  { id: 'persona1',  label: 'Persona 1', iconType: 'globe' },
  { id: 'persona2',  label: 'Persona 2', iconType: 'globe' },
  { id: 'persona3',  label: 'Persona 3', iconType: 'globe' },
];

function TabIcon({ type }: { type: string }) {
  if (type === 'globe') return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/>
    </svg>
  );
}

export default function AiProduct() {
  const [activeTab, setActiveTab] = useState('prototype');

  return (
    <section className="default-section">
      <div className="default-container w-container">
        <p className="paragraph-new">
          Bellow is a fully functional version of the prototype i&rsquo;ve integrated into webflow.
          Try it yourself and see how it custom adapts to specific users and cases. The goal
          isn&rsquo;t just dynamically generated website content, its hyper personalised content.
        </p>
        <h2 id="section--the-product" className="h2">the product</h2>
      </div>

      {/* Chrome browser wrapper */}
      <div className="div-block-26">
        <div className="default-container w-container" style={{ maxWidth: '100%', padding: '0 2rem' }}>
          <div className="chrome-container">
            {/* Tab bar */}
            <div className="tab-bar">
              <div className="window-controls">
                <div className="icon-window-controls close" />
                <div className="icon-window-controls hide" />
                <div className="icon-window-controls expand" />
              </div>
              <div className="tabs-menu">
                {TABS.map(t => (
                  <div
                    key={t.id}
                    className={`tab${activeTab === t.id ? ' active-tab' : ''}`}
                    onClick={() => setActiveTab(t.id)}
                    role="tab"
                    aria-selected={activeTab === t.id}
                  >
                    <TabIcon type={t.iconType} />
                    <span className="tab-text">{t.label}</span>
                    <span className="close-tab">
                      <svg className="close-tab-icon" width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="tab-content-panels">
              <div className={`tab-panel${activeTab === 'prototype' ? ' active-panel' : ''}`}>
                <AICheckoutDemo show={activeTab === 'prototype'} />
              </div>
              <div className={`tab-panel${activeTab === 'persona1' ? ' active-panel' : ''}`}>
                <PersonaOutput persona={1} />
              </div>
              <div className={`tab-panel${activeTab === 'persona2' ? ' active-panel' : ''}`}>
                <PersonaOutput persona={2} />
              </div>
              <div className={`tab-panel${activeTab === 'persona3' ? ' active-panel' : ''}`}>
                <PersonaOutput persona={3} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
