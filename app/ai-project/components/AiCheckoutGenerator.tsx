'use client';

import { useState, useRef }                from 'react';
import { generateCheckout }                 from './ai-checkout-mock';
import type { CheckoutData, TripContext }   from './ai-checkout-types';
import CheckoutOutput, { Icon }             from './CheckoutOutput';
import { getBannerForDestination }          from '../lib/checkout-banners';

/* ── Form state ──────────────────────────────────────────────────── */
interface FormState {
  name:             string;
  destination:      string;
  countryOrigin:    string;
  tripDates:        string;
  lengthOfStay:     string;
  ageRange:         string;
  travelPurpose:    string;
  travelExperience: string;
  interests:        string;
  budgetLevel:      string;
  groupType:        string;
}

const EMPTY_FORM: FormState = {
  name: '', destination: '', countryOrigin: '', tripDates: '',
  lengthOfStay: '', ageRange: '', travelPurpose: '', travelExperience: '',
  interests: '', budgetLevel: '', groupType: '',
};

/* ── Idle placeholder ────────────────────────────────────────────── */
function IdlePlaceholder() {
  return (
    <div className="aip-gen-idle">
      <div className="aip-gen-idle-inner">
        <div className="aip-gen-idle-icon">
          <Icon name="compass" size={17} stroke="#ccc" />
        </div>
        <p className="aip-gen-idle-text">
          Fill in your trip details and hit Generate to see your personalised summary
        </p>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────── */
export default function AiCheckoutGenerator() {
  const [form,         setForm]         = useState<FormState>(EMPTY_FORM);
  const [checkout,     setCheckout]     = useState<CheckoutData | null>(null);
  const [isLoading,    setIsLoading]    = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [destError,    setDestError]    = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  function update(field: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'destination' && destError && value.trim()) setDestError(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.destination.trim()) { setDestError(true); return; }
    setDestError(false);
    runGenerate();
  }

  function runGenerate() {
    abortRef.current?.abort();
    const ctrl        = new AbortController();
    abortRef.current  = ctrl;

    const tripContext: TripContext = {
      destination: form.destination.trim(),
      ...(form.name.trim()             && { name:             form.name.trim()             }),
      ...(form.countryOrigin.trim()    && { countryOrigin:    form.countryOrigin.trim()    }),
      ...(form.tripDates.trim()        && { tripDates:        form.tripDates.trim()        }),
      ...(form.lengthOfStay.trim()     && { lengthOfStay:     form.lengthOfStay.trim()     }),
      ...(form.ageRange                && { ageRange:         form.ageRange                }),
      ...(form.travelPurpose           && { travelPurpose:    form.travelPurpose           }),
      ...(form.travelExperience        && { travelExperience: form.travelExperience        }),
      ...(form.interests.trim()        && { interests:        form.interests.trim()        }),
      ...(form.budgetLevel             && { budgetLevel:      form.budgetLevel             }),
      ...(form.groupType               && { groupType:        form.groupType               }),
    };

    setHasSubmitted(true);
    setIsLoading(true);
    setError(null);
    setCheckout(null);

    generateCheckout({ tripContext, signal: ctrl.signal })
      .then(data => {
        if (ctrl.signal.aborted) return;
        setCheckout(data);
        setIsLoading(false);
      })
      .catch(err => {
        if (ctrl.signal.aborted) return;
        if ((err as DOMException)?.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        setIsLoading(false);
      });
  }

  return (
    <section className="default-section" id="try-it-yourself">
      <span id="section--the-product" aria-hidden="true" />
      <div className="default-container w-container">
        <p className="paragraph-new">
          Enter a traveller profile and generate a personalised post-checkout travel summary
          using the live AI system.
        </p>
        <h2 id="section--try-it" className="h2">try it yourself</h2>
      </div>

      <div className="div-block-26">
        <div className="default-container w-container" style={{ maxWidth: '100%', padding: '0 2rem' }}>
          <div className="aip-gen-layout">

            {/* ── Left: Form ──────────────────────────────────── */}
            <div className="aip-gen-form-panel">
              <div className="aip-gen-note">
                In a real travel platform, these details would already come from the booking flow,
                customer profile, and trip history. This form makes that data visible so you can
                test how the checkout adapts.
              </div>
              <span className="aip-gen-section-label">Traveller profile</span>

              <form onSubmit={handleSubmit} noValidate>
                <div className="aip-gen-field-grid">

                  {/* Name */}
                  <div>
                    <label className="aip-gen-label">Your name</label>
                    <input
                      type="text"
                      className="aip-gen-input"
                      placeholder="e.g. Alex"
                      value={form.name}
                      onChange={e => update('name', e.target.value)}
                    />
                  </div>

                  {/* Travelling as */}
                  <div>
                    <label className="aip-gen-label">Travelling as</label>
                    <div className="aip-gen-select-wrap">
                      <select
                        className="aip-gen-select"
                        value={form.groupType}
                        onChange={e => update('groupType', e.target.value)}
                      >
                        <option value="">Select</option>
                        <option>Solo</option>
                        <option>Couple</option>
                        <option>Family with kids</option>
                        <option>Group of friends</option>
                      </select>
                    </div>
                  </div>

                  {/* Destination — full width, required */}
                  <div className="aip-gen-field-full">
                    <label className="aip-gen-label required">Destination</label>
                    <input
                      type="text"
                      className={`aip-gen-input${destError ? ' error' : ''}`}
                      placeholder="e.g. Tokyo, Japan"
                      value={form.destination}
                      onChange={e => update('destination', e.target.value)}
                    />
                    {destError && (
                      <p className="aip-gen-field-error">Please enter a destination to continue.</p>
                    )}
                  </div>

                  {/* Flying from */}
                  <div>
                    <label className="aip-gen-label">Flying from</label>
                    <input
                      type="text"
                      className="aip-gen-input"
                      placeholder="e.g. Sydney"
                      value={form.countryOrigin}
                      onChange={e => update('countryOrigin', e.target.value)}
                    />
                  </div>

                  {/* Trip dates */}
                  <div>
                    <label className="aip-gen-label">Trip dates</label>
                    <input
                      type="text"
                      className="aip-gen-input"
                      placeholder="e.g. Late December"
                      value={form.tripDates}
                      onChange={e => update('tripDates', e.target.value)}
                    />
                  </div>

                  {/* Length of stay */}
                  <div>
                    <label className="aip-gen-label">Length of stay</label>
                    <input
                      type="text"
                      className="aip-gen-input"
                      placeholder="e.g. 7 nights"
                      value={form.lengthOfStay}
                      onChange={e => update('lengthOfStay', e.target.value)}
                    />
                  </div>

                  {/* Age range */}
                  <div>
                    <label className="aip-gen-label">Age range</label>
                    <div className="aip-gen-select-wrap">
                      <select
                        className="aip-gen-select"
                        value={form.ageRange}
                        onChange={e => update('ageRange', e.target.value)}
                      >
                        <option value="">Select</option>
                        <option>Teens</option>
                        <option>20s</option>
                        <option>30s</option>
                        <option>40s</option>
                        <option>50s</option>
                        <option>60s+</option>
                      </select>
                    </div>
                  </div>

                  {/* Purpose */}
                  <div>
                    <label className="aip-gen-label">Purpose</label>
                    <div className="aip-gen-select-wrap">
                      <select
                        className="aip-gen-select"
                        value={form.travelPurpose}
                        onChange={e => update('travelPurpose', e.target.value)}
                      >
                        <option value="">Select</option>
                        <option>Leisure</option>
                        <option>Honeymoon</option>
                        <option>Family holiday</option>
                        <option>Adventure</option>
                        <option>Business</option>
                        <option>Cultural</option>
                      </select>
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="aip-gen-label">Travel experience</label>
                    <div className="aip-gen-select-wrap">
                      <select
                        className="aip-gen-select"
                        value={form.travelExperience}
                        onChange={e => update('travelExperience', e.target.value)}
                      >
                        <option value="">Select</option>
                        <option>First time</option>
                        <option>Beginner</option>
                        <option>Moderate</option>
                        <option>Experienced</option>
                        <option>Expert</option>
                      </select>
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="aip-gen-label">Budget</label>
                    <div className="aip-gen-select-wrap">
                      <select
                        className="aip-gen-select"
                        value={form.budgetLevel}
                        onChange={e => update('budgetLevel', e.target.value)}
                      >
                        <option value="">Select</option>
                        <option>Budget</option>
                        <option>Mid-range</option>
                        <option>Premium</option>
                        <option>Luxury</option>
                      </select>
                    </div>
                  </div>

                  {/* Interests — full width */}
                  <div className="aip-gen-field-full">
                    <label className="aip-gen-label">Interests</label>
                    <input
                      type="text"
                      className="aip-gen-input"
                      placeholder="e.g. food, photography, hiking, art"
                      value={form.interests}
                      onChange={e => update('interests', e.target.value)}
                    />
                  </div>

                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="aip-gen-submit-btn"
                >
                  {isLoading ? (
                    <>
                      <span className="aip-gen-spinner" />
                      Generating…
                    </>
                  ) : (
                    'Generate summary'
                  )}
                </button>
              </form>
            </div>

            {/* ── Right: Output ────────────────────────────────── */}
            <div>
              {hasSubmitted ? (
                <CheckoutOutput
                  checkout={checkout}
                  isLoading={isLoading}
                  error={error}
                  onRetry={runGenerate}
                  bannerSrc={getBannerForDestination(form.destination)}
                />
              ) : (
                <IdlePlaceholder />
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
