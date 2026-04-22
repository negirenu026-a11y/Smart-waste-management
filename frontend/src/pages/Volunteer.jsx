import { handleImageError } from '../utils/imageFallback.js'

function Volunteer() {
  const benefits = [
    'Hands-on experience in conservation projects.',
    'New skills from community outreach and event coordination.',
    'Connection with a passionate environmental network.',
  ]

  return (
    <section className="section bg-light py-5">
      <div className="container">
        <div className="section-heading text-center mb-5">
          <span className="eyebrow text-brand">Volunteer</span>
          <h2 className="fw-bold">Join our volunteer family</h2>
          <p className="text-secondary mx-auto" style={{ maxWidth: '700px' }}>
            Volunteering is a great way to support conservation work while making
            meaningful connections with like-minded people.
          </p>
        </div>
        <div className="row align-items-center gy-4">
          <div className="col-lg-6">
            <div className="volunteer-card rounded-4 shadow-sm p-5 bg-white h-100">
              <h4 className="fw-bold" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Volunteer benefits</h4>
              <ul className="list-unstyled text-secondary mt-3">
                {benefits.map((text) => (
                  <li className="mb-4" key={text} style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
                    <i className="bi bi-check-circle-fill text-brand me-2" style={{ fontSize: '1.2rem' }}></i>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card rounded-4 overflow-hidden shadow-sm h-100">
              <img
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"
                alt="Volunteer"
                className="img-fluid"
                style={{ 
                  width: '100%', 
                  height: '100%',
                  minHeight: '400px',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
                loading="lazy"
                onError={handleImageError}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Volunteer
