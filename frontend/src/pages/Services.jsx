function Services() {
  const services = [
    {
      title: 'Forest Regeneration',
      description: 'Plant trees and restore forest corridors across vulnerable land.',
      icon: 'bi-tree-fill',
    },
    {
      title: 'Clean Water Projects',
      description: 'Protect rivers and provide clean water access to communities.',
      icon: 'bi-droplet-fill',
    },
    {
      title: 'Climate Education',
      description: 'Run workshops that empower citizens and schools to act sustainably.',
      icon: 'bi-mortarboard-fill',
    },
    {
      title: 'Wildlife Protection',
      description: 'Rescue and rehabilitate wildlife while safeguarding habitats.',
      icon: 'bi-heart-fill',
    },
  ]

  return (
    <section className="section py-5">
      <div className="container">
        <div className="section-heading text-center mb-5">
          <span className="eyebrow text-brand">Our services</span>
          <h2 className="fw-bold">Support that drives action</h2>
          <p className="text-secondary mx-auto" style={{ maxWidth: '700px' }}>
            Our environmental services combine advocacy, field work, and strategic
            partnerships to support sustainable ecosystems.
          </p>
        </div>
        <div className="row g-4">
          {services.map((service) => (
            <div className="col-md-6 col-xl-3" key={service.title}>
              <div className="card service-card h-100 border-0 shadow-sm rounded-4 p-4">
                <div className="icon-box bg-brand text-white mb-3">
                  <i className={`bi ${service.icon} fs-3`}></i>
                </div>
                <h5>{service.title}</h5>
                <p className="text-secondary">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
