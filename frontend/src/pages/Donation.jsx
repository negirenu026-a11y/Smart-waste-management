import { Link } from 'react-router-dom'

function Donation() {
  const donations = [
    {
      title: 'Save Forests',
      amount: '$25',
      description: 'Plant a tree and protect forest habitats from loss.',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Clean Water',
      amount: '$50',
      description: 'Provide reusable bottles and filters to rural communities.',
      image: 'https://images.unsplash.com/photo-1508738773434-c26b3d09e071?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Wildlife Rescue',
      amount: '$100',
      description: 'Help rehabilitate injured animals and secure their habitats.',
      image: 'https://images.unsplash.com/photo-1426604966848-d7bcdd5735a9?auto=format&fit=crop&w=500&q=80',
    },
  ]

  return (
    <section className="section py-5">
      <div className="container">
        <div className="section-heading text-center mb-5">
          <span className="eyebrow text-brand">Donation</span>
          <h2 className="fw-bold">Support our conservation work</h2>
          <p className="text-secondary mx-auto" style={{ maxWidth: '700px' }}>
            Your contribution helps us protect ecosystems, empower communities,
            and preserve wildlife around the world.
          </p>
        </div>
        <div className="row g-4">
          {donations.map((item) => (
            <div className="col-md-4" key={item.title}>
              <div className="card donation-card h-100 rounded-4 shadow-sm border-0 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  style={{ height: '220px', objectFit: 'cover', width: '100%' }}
                />
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="mb-0">{item.title}</h5>
                    <span className="fs-5 text-brand fw-semibold">{item.amount}</span>
                  </div>
                  <p className="text-secondary">{item.description}</p>
                  <Link className="btn btn-warning text-dark" to="/contact">
                    Donate now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Donation
