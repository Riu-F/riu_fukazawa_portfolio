'use client';

import AiCheckoutPrototype from './AiCheckoutPrototype';

export default function AiProduct() {
  return (
    <section className="default-section">
      <div className="default-container w-container">
        <p className="paragraph-new">
          Below is a fully functional version of the prototype. Try switching between personas to
          see how the page adapts — same booking confirmation, different traveller, entirely
          different content. Click any card to expand it for more detail.
        </p>
        <h2 id="section--the-product" className="h2">the product</h2>
      </div>

      <div className="div-block-26">
        <div className="default-container w-container" style={{ maxWidth: '100%', padding: '0 2rem' }}>
          <AiCheckoutPrototype />
        </div>
      </div>
    </section>
  );
}
