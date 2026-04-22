function Contact() {
  return (
    <section className="section py-5">
      <div className="container">
        <div className="section-heading text-center mb-5">
          <span className="eyebrow text-brand">Contact</span>
          <h2 className="fw-bold">Get in touch with us</h2>
          <p className="text-secondary mx-auto" style={{ maxWidth: '700px' }}>
            Send a message to learn how you can take part in our next campaign or
            support our work.
          </p>
        </div>
        <div className="row gx-5 gy-4">
          <div className="col-lg-5">
            <div className="card rounded-4 shadow-sm p-4 h-100 border-0">
              <h5 className="fw-bold mb-3">Contact information</h5>
              <p className="mb-2 text-secondary">
                <strong>Address:</strong> 123 Green Lane, Nature City
              </p>
              <p className="mb-2 text-secondary">
                <strong>Email:</strong> hello@environs.org
              </p>
              <p className="mb-0 text-secondary">
                <strong>Phone:</strong> +1 (555) 123-4567
              </p>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="card rounded-4 shadow-sm border-0 p-4">
              <form className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" placeholder="Your name" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" placeholder="Your email" />
                </div>
                <div className="col-12">
                  <label className="form-label">Subject</label>
                  <input type="text" className="form-control" placeholder="Subject" />
                </div>
                <div className="col-12">
                  <label className="form-label">Message</label>
                  <textarea className="form-control" rows="5" placeholder="Write your message"></textarea>
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-warning text-dark px-4">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
