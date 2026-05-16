export default function SupermarketFooter() {
  return (
    <section className="footer-section">
      <div className="container-4 w-container">
        <div className="footer-flex">
          <h2 className="footer-title">
            <strong>
              Let’s <br />
              work <br />
              Together
            </strong>
          </h2>
          <div className="div-block-9">
            <div className="footer-link">Get in Contact</div>
            <a
              href="https://www.linkedin.com/in/riu-fukazawa-a2277a21b"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Linkedin
            </a>
            <a href="#" className="footer-link">
              Resume
            </a>
            <a href="mailto:riu@sol.io?subject=Get%20in%20touch!%20" className="footer-link">
              Email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
