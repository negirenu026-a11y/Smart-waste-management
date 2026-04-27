import { handleImageError } from '../utils/imageFallback.js'

function About() {
  return (
    <section className="section py-5">
      <div className="container">
        <div className="section-heading text-center mb-5">
          <span className="eyebrow text-brand">About Environs</span>
          <h2 className="fw-bold">A nature-first environmental template</h2>
          <p className="text-secondary mx-auto" style={{ maxWidth: '700px' }}>
            Environs is built to help environmental organizations share their
            story, their campaigns, and the impact they make in a modern,
            responsive React application.
          </p>
        </div>

        <div className="row gy-4 align-items-center">
          <div className="col-lg-6">
            <img
              src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1100&q=80"
              alt="About us"
              className="img-fluid rounded-4 shadow"
            />
          </div>
          <div className="col-lg-6">
            <h3 className="fw-bold">Our journey begins with care for the planet</h3>
            <p className="text-secondary">
              We collaborate with communities, governments, and businesses to
              design programs that preserve biodiversity, reduce pollution, and
              empower future generations.
            </p>
            <div className="row gy-3">
              <div className="col-sm-6">
                <div className="feature-card p-4 rounded-4 border">
                  <h5>Education</h5>
                  <p className="mb-0 text-secondary">
                    Teach sustainable choices through workshops and campaigns.
                  </p>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="feature-card p-4 rounded-4 border">
                  <h5>Action</h5>
                  <p className="mb-0 text-secondary">
                    Launch practical projects that restore land, water, and wildlife.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-5">
          <div className="col-md-4">
            <div className="info-card rounded-4 p-4 h-100 shadow-sm">
              <h4 className="fw-bold">Our mission</h4>
              <p className="text-secondary">
                Protect critical habitats and empower communities with sustainable solutions.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-card rounded-4 p-4 h-100 shadow-sm">
              <h4 className="fw-bold">Our vision</h4>
              <p className="text-secondary">
                A greener world where nature thrives and people live in balance.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-card rounded-4 p-4 h-100 shadow-sm">
              <h4 className="fw-bold">Our values</h4>
              <p className="text-secondary">
                Transparency, collaboration, resilience, and measurable impact.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About    
