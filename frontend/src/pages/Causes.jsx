import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { handleImageError } from '../utils/imageFallback.js'

function Causes() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const cardsPerSlide = 3

  const causes = [
    {
      title: 'Save The Forests',
      description: 'Stop deforestation and rebuild natural habitats for future generations.',
      image:
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Ocean Clean-Up',
      description: 'Collect marine waste and support communities affected by plastic pollution.',
      image:
        'https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Wildlife Welfare',
      description: 'Help injured animals recover while preserving their natural environment.',
      image:
        'https://images.unsplash.com/photo-1526287500198-8d25a7a8b089?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Water Conservation',
      description: 'Protect watersheds and bring safe water to remote communities.',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Climate Action',
      description: 'Reduce carbon footprints through renewable energy projects.',
      image:
        'https://images.unsplash.com/photo-1509391366360-2e938aa1ef14?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Community Gardens',
      description: 'Build sustainable food systems in urban and rural areas.',
      image:
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Ecosystem Restoration',
      description: 'Restore degraded ecosystems and protect endangered species.',
      image:
        'https://images.unsplash.com/photo-1426604966848-d7bcdd5735a9?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Education & Awareness',
      description: 'Empower communities through environmental education programs.',
      image:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=80',
    },
  ]

  const totalSlides = Math.ceil(causes.length / cardsPerSlide)

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, 5000)
    return () => clearInterval(timer)
  }, [totalSlides])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const displayedCauses = causes.slice(
    currentSlide * cardsPerSlide,
    currentSlide * cardsPerSlide + cardsPerSlide
  )

  return (
    <section className="section bg-light py-5">
      <div className="container">
        <div className="section-heading text-center mb-5">
          <span className="eyebrow text-brand">Our Causes</span>
          <h2 className="fw-bold">Support our current campaigns</h2>
          <p className="text-secondary mx-auto" style={{ maxWidth: '700px' }}>
            Learn more about the initiatives that are making a measurable
            difference across communities and ecosystems.
          </p>
        </div>

        {/* Flip Card Styles */}
        <style>{`
          .flip-card {
            perspective: 1000px;
            height: 400px;
            width: 100%;
          }
          .flip-card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transition: transform 0.6s;
            transform-style: preserve-3d;
          }
          .flip-card:hover .flip-card-inner {
            transform: rotateY(180deg);
          }
          .flip-card-front, .flip-card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
          }
          .flip-card-back {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            transform: rotateY(180deg);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            text-align: center;
            border-radius: 1rem;
          }
          .flip-card-back h5 {
            color: white;
            margin-bottom: 1rem;
          }
          .flip-card-back p {
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 1.5rem;
          }
        `}</style>

        {/* Causes Carousel */}
        <div className="position-relative">
          <div 
            className="row g-4"
            style={{
              transition: 'opacity 0.5s ease-in-out',
              opacity: 1,
            }}
          >
            {displayedCauses.map((cause) => (
              <div className="col-md-6 col-xl-4" key={cause.title}>
                <div className="flip-card">
                  <div className="flip-card-inner">
                    {/* Front of card */}
                    <div className="flip-card-front">
                      <div className="card cause-card shadow-sm rounded-4 overflow-hidden h-100 w-100">
                        <img 
                          src={cause.image} 
                          alt={cause.title} 
                          className="card-img-top" 
                          style={{ height: '200px', objectFit: 'cover', width: '100%' }}
                          loading="lazy" 
                          onError={handleImageError} 
                        />
                        <div className="card-body">
                          <h5>{cause.title}</h5>
                          <p className="text-secondary">{cause.description}</p>
                          <Link className="btn btn-link p-0" to="/donation">
                            Support now
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* Back of card */}
                    <div className="flip-card-back">
                      <div>
                        <h5>{cause.title}</h5>
                        <p>{cause.description}</p>
                        <Link className="btn btn-light btn-sm" to="/donation">
                          Support Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className="position-absolute start-0 top-50 translate-middle-y"
            style={{
              zIndex: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              padding: '10px 15px',
              cursor: 'pointer',
              borderRadius: '50%',
              width: '45px',
              height: '45px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '-25px',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.8)')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)')}
          >
            ❮
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="position-absolute end-0 top-50 translate-middle-y"
            style={{
              zIndex: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              padding: '10px 15px',
              cursor: 'pointer',
              borderRadius: '50%',
              width: '45px',
              height: '45px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '-25px',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.8)')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)')}
          >
            ❯
          </button>

          {/* Carousel Indicators */}
          <div className="d-flex justify-content-center gap-2 mt-5">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                style={{
                  width: currentSlide === index ? '30px' : '10px',
                  height: '10px',
                  borderRadius: '50px',
                  border: 'none',
                  backgroundColor: currentSlide === index ? '#ffc107' : '#ddd',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Causes
