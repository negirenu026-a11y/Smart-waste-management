import { handleImageError } from '../utils/imageFallback.js'

function Gallery() {
  const galleryItems = [
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=900&q=80',
  ]

  return (
    <section className="section bg-light py-5">
      <div className="container">
        <div className="section-heading text-center mb-5">
          <span className="eyebrow text-brand">Gallery</span>
          <h2 className="fw-bold">Images from our projects</h2>
          <p className="text-secondary mx-auto" style={{ maxWidth: '700px' }}>
            Explore moments from our conservation efforts, events, and community
            projects.
          </p>
        </div>
        <div className="row g-3">
          {galleryItems.map((src, index) => (
            <div className="col-12 col-sm-6 col-lg-4" key={index}>
              <div className="gallery-card rounded-4 overflow-hidden shadow-sm">
                <img src={src} alt={`Gallery ${index + 1}`} className="img-fluid" loading="lazy" onError={handleImageError} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Gallery
