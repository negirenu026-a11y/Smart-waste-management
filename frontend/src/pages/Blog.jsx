function Blog() {
  const posts = [
    {
      title: 'How to start a local cleanup',
      excerpt: 'Step-by-step guidance for organizing community cleanup action in your neighborhood.',
      date: 'March 15, 2026',
    },
    {
      title: 'The benefits of planting native trees',
      excerpt: 'Learn why native species matter and how they improve wildlife habitat.',
      date: 'April 1, 2026',
    },
    {
      title: 'Reducing plastic use at home',
      excerpt: 'Simple daily habits that can reduce waste and protect oceans.',
      date: 'May 4, 2026',
    },
  ]

  return (
    <section className="section py-5">
      <div className="container">
        <div className="section-heading text-center mb-5">
          <span className="eyebrow text-brand">Blog</span>
          <h2 className="fw-bold">Stories that inspire change</h2>
          <p className="text-secondary mx-auto" style={{ maxWidth: '700px' }}>
            Read our latest updates on conservation, campaigns, and volunteer work.
          </p>
        </div>
        <div className="row g-4">
          {posts.map((post) => (
            <div className="col-md-6 col-lg-4" key={post.title}>
              <div className="card blog-card h-100 shadow-sm rounded-4 overflow-hidden">
                <div className="card-body p-4">
                  <div className="mb-2 text-brand small fw-semibold">{post.date}</div>
                  <h5>{post.title}</h5>
                  <p className="text-secondary">{post.excerpt}</p>
                  <a className="btn btn-link p-0" href="/blog">
                    Read more
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Blog
