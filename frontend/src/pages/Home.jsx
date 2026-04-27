import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { handleImageError } from '../utils/imageFallback.js'
import CityDataDisplay from '../components/CityDataDisplay';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentCauseSlide, setCurrentCauseSlide] = useState(0)
  const [statsCount, setStatsCount] = useState({ projects: 0, volunteers: 0, people: 0, awards: 0 })
  const [statsStarted, setStatsStarted] = useState(false)
  const statsRef = useRef(null)
  const causesPerSlide = 3
  const services = [
    {
      title: 'Ecosystem Protection',
      description:
        'Safeguard forests, wetlands, and rivers with targeted restoration programs.',
      icon: 'bi-tree-fill',
    },
    {
      title: 'Community Outreach',
      description:
        'Engage local communities through workshops, cleanup drives, and awareness events.',
      icon: 'bi-people-fill',
    },
    {
      title: 'Renewable Energy',
      description:
        'Introduce clean energy proposals that reduce carbon footprints at scale.',
      icon: 'bi-lightning-charge-fill',
    },
    {
      title: 'Wildlife Rescue',
      description:
        'Protect endangered species with rescue, rehabilitation, and habitat care.',
      icon: 'bi-heart-pulse-fill',
    },
  ]

  const causes = [
    {
      title: 'Save The Forests',
      text: 'Stop deforestation and rebuild natural habitats for future generations.',
      image:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Ocean Clean-Up',
      text: 'Collect marine waste and support communities affected by plastic pollution.',
      image:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Wildlife Welfare',
      text: 'Help injured animals recover while preserving their natural environment.',
      image:
        'https://images.unsplash.com/photo-1526287500198-8d25a7a8b089?auto=format&fit=crop&w=1200&q=80',
    },
  ]

  const galleryImages = [
    'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
  ]

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80',
      title: 'Protect Environment, Protect Future',
      subtitle: 'We\'ll Save Our Planet',
      description: 'Join our mission to restore ecosystems, support communities, and inspire change with practical environmental programs.'
    },
    {
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
      title: 'Save Our Forests',
      subtitle: 'Ecosystem Protection',
      description: 'Safeguard forests, wetlands, and rivers with targeted restoration programs for a sustainable future.'
    },
    {
      image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1600&q=80',
      title: 'Ocean Conservation',
      subtitle: 'Marine Life Matters',
      description: 'Collect marine waste and support communities affected by plastic pollution worldwide.'
    }
  ]

 
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

 
  const totalCauseSlides = Math.ceil(causes.length / causesPerSlide)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCauseSlide((prev) => (prev + 1) % totalCauseSlides)
    }, 5000)
    return () => clearInterval(timer)
  }, [totalCauseSlides])


  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsStarted) {
          setStatsStarted(true)
          const duration = 800 
          const startTime = Date.now()
          
          const animateCounters = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            
            setStatsCount({
              projects: Math.floor(120 * progress),
              volunteers: Math.floor(24 * progress),
              people: Math.floor(35 * progress),
              awards: Math.floor(8 * progress),
            })
            
            if (progress < 1) {
              requestAnimationFrame(animateCounters)
            }
          }
          
          animateCounters()
        }
      })
    }, { threshold: 0.3 })
    
    if (statsRef.current) {
      observer.observe(statsRef.current)
    }
    
    return () => observer.disconnect()
  }, [statsStarted])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const nextCauseSlide = () => {
    setCurrentCauseSlide((prev) => (prev + 1) % totalCauseSlides)
  }

  const prevCauseSlide = () => {
    setCurrentCauseSlide((prev) => (prev - 1 + totalCauseSlides) % totalCauseSlides)
  }

  const displayedCauses = causes.slice(
    currentCauseSlide * causesPerSlide,
    currentCauseSlide * causesPerSlide + causesPerSlide
  )

  return (
    <>      {/* Hero Carousel Section */}
      <section className="hero-section position-relative text-white overflow-hidden" style={{ height: '95vh', margin: '0', padding: '0', width: '100%', marginTop: '-5.5rem' }}>
        <div className="carousel-container position-relative h-100">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className="carousel-slide position-absolute w-100 h-100"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: currentSlide === index ? 1 : 0,
                transition: 'opacity 0.8s ease-in-out',
                zIndex: currentSlide === index ? 1 : 0,
              }}
            >
              {/* Dark overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 1,
                }}
              ></div>

              {/* Carousel content */}
              <div
                className="carousel-content d-flex align-items-center h-100 position-relative"
                style={{ zIndex: 2 }}
              >
                <div className="container">
                  <div className="row justify-content-center">
                    <div className="col-lg-8 text-center">
                      <span className="eyebrow d-block mb-3 text-warning">{slide.subtitle}</span>
                      <h1 className="display-4 fw-bold mb-3">{slide.title}</h1>
                      <p className="lead text-white-75 mb-4">{slide.description}</p>
                      <div className="d-flex flex-wrap gap-3 justify-content-center">
                        <a className="btn btn-warning btn-lg text-dark" href="#about">
                          Learn More
                        </a>
                        <Link className="btn btn-outline-light btn-lg" to="/contact">
                          Contact Us
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Navigation Buttons */}
        <button
          className="carousel-btn carousel-btn-prev position-absolute start-0 top-50 translate-middle-y"
          onClick={prevSlide}
          style={{
            zIndex: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            padding: '15px 20px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            marginLeft: '20px',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.6)')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)')}
        >
          ❮
        </button>

        <button
          className="carousel-btn carousel-btn-next position-absolute end-0 top-50 translate-middle-y"
          onClick={nextSlide}
          style={{
            zIndex: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            padding: '15px 20px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            marginRight: '20px',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.6)')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)')}
        >
          ❯
        </button>

        {/* Carousel Indicators */}
        <div
          className="carousel-indicators position-absolute bottom-0 start-50 translate-middle-x"
          style={{ zIndex: 3, marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}
        >
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: currentSlide === index ? '30px' : '12px',
                height: '12px',
                borderRadius: '50px',
                border: 'none',
                backgroundColor: currentSlide === index ? '#ffc107' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            ></button>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section py-5">
        <div className="container">
          <div className="row align-items-center gy-4">
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=80"
                alt="About our mission"
                className="img-fluid rounded-4 shadow"
                style={{ maxHeight: '450px', objectFit: 'cover', width: '100%' }}
              />
            </div>
            <div className="col-lg-6">
              <span className="eyebrow text-brand" style={{ fontSize: '0.95rem' }}>About us</span>
              <h2 className="fw-bold" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Our main goal is to protect environment</h2>
              <p className="text-secondary" style={{ fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                We support local communities and restore ecosystems through
                education, direct action, and long-term planning. Our experienced
                team delivers measurable impact in every project.
              </p>
              <div className="row gy-3">
                <div className="col-sm-6">
                  <div className="feature-card p-3 rounded-4 border" style={{ height: '100%' }}>
                    <h5 className="mb-2" style={{ fontSize: '1.1rem' }}>Mission</h5>
                    <p className="mb-0 text-secondary" style={{ fontSize: '0.95rem' }}>
                      Preserve the earth with sustainable actions that matter.
                    </p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="feature-card p-3 rounded-4 border" style={{ height: '100%' }}>
                    <h5 className="mb-2" style={{ fontSize: '1.1rem' }}>Vision</h5>
                    <p className="mb-0 text-secondary" style={{ fontSize: '0.95rem' }}>
                      Build a future where nature and communities thrive together.
                    </p>
                  </div>
                </div>
              </div>
              <a className="btn btn-outline-brand mt-4" href="/about">
                Explore More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section bg-light py-5">
        <div className="container">
          <div className="section-heading text-center mb-5">
            <span className="eyebrow text-brand">What we do</span>
            <h2 className="fw-bold">How we protect environment</h2>
          </div>
          <div className="row g-4">
            {services.map((service) => (
              <div className="col-md-6 col-xl-3" key={service.title}>
                <div className="card service-card h-100 border-0 shadow-sm rounded-4 p-4">
                  <div className="icon-box bg-brand text-white mb-3">
                    <i className={`bi ${service.icon} fs-3`}></i>
                  </div>
                  <h5>{service.title}</h5>
                  <p className="text-secondary mb-0">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
{/* Causes Section */}
      
      <section className="section py-5">
        <div className="container">
          <div className="section-heading text-center mb-5">
            <span className="eyebrow text-brand">Our causes</span>
            <h2 className="fw-bold">Support our current campaigns</h2>
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
                        <div className="card cause-card overflow-hidden rounded-4 shadow-sm h-100 w-100">
                          <img 
                            src={cause.image} 
                            className="card-img-top" 
                            alt={cause.title}
                            style={{ height: '200px', objectFit: 'cover', width: '100%' }}
                            loading="lazy" 
                            onError={handleImageError} 
                          />
                          <div className="card-body">
                            <h5 className="card-title">{cause.title}</h5>
                            <p className="card-text text-secondary">{cause.text}</p>
                            <Link className="btn btn-link p-0" to="/causes">
                              Learn more
                            </Link>
                          </div>
                        </div>
                      </div>
                      {/* Back of card */}
                      <div className="flip-card-back">
                        <div>
                          <h5>{cause.title}</h5>
                          <p>{cause.text}</p>
                          <Link className="btn btn-light btn-sm" to="/causes">
                            Learn More
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
              onClick={prevCauseSlide}
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
              onClick={nextCauseSlide}
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
              {Array.from({ length: totalCauseSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCauseSlide(index)}
                  style={{
                    width: currentCauseSlide === index ? '30px' : '10px',
                    height: '10px',
                    borderRadius: '50px',
                    border: 'none',
                    backgroundColor: currentCauseSlide === index ? '#ffc107' : '#ddd',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* City Data Section */}
      <section className="section bg-light py-5">
        <div className="container">
          <div className="section-heading text-center mb-5">
            <span className="eyebrow text-brand">Regional Data</span>
            <h2 className="fw-bold">City Waste Management Info</h2>
          </div>
          <CityDataDisplay />
        </div>
      </section>

{/* Stats Section */}
      
      <section className="section bg-dark text-white py-5" ref={statsRef}>
        <div className="container">
          <div className="row gy-4 text-center">
            {[
              { value: statsCount.projects, label: 'Projects Completed', suffix: '+' },
              { value: statsCount.volunteers, label: 'Volunteer Support', suffix: '/7' },
              { value: statsCount.people, label: 'People Helped', suffix: 'K' },
              { value: statsCount.awards, label: 'Awards Won', suffix: '' },
            ].map((item) => (
              <div className="col-6 col-md-3" key={item.label}>
                <h3 className="display-6 fw-bold mb-1">{item.value}{item.suffix}</h3>
                <p className="mb-0 text-white-75">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
{/* Gallery Section */}
      
      <section className="section py-5">
        <div className="container">
          <div className="section-heading text-center mb-5">
            <span className="eyebrow text-brand">Gallery</span>
            <h2 className="fw-bold">Moments from our mission</h2>
          </div>

          {/* Gallery Hover Styles */}
          <style>{`
            .gallery-card {
              position: relative;
              overflow: hidden;
              cursor: pointer;
            }
            .gallery-card img {
              transition: transform 0.4s ease, filter 0.4s ease;
              width: 100%;
              height: 250px;
              object-fit: cover;
              display: block;
            }
            .gallery-card:hover img {
              transform: scale(1.1);
              filter: brightness(0.6);
            }
            .gallery-overlay {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(102, 126, 234, 0.8);
              display: flex;
              align-items: center;
              justify-content: center;
              opacity: 0;
              transition: opacity 0.4s ease;
              padding: 1.5rem;
              text-align: center;
            }
            .gallery-card:hover .gallery-overlay {
              opacity: 1;
            }
            .gallery-overlay h5 {
              color: white;
              margin-bottom: 0.5rem;
              font-weight: 600;
            }
            .gallery-overlay p {
              color: rgba(255, 255, 255, 0.9);
              font-size: 0.9rem;
              margin: 0;
            }
          `}</style>

          <div className="row g-3">
            {galleryImages.map((image, index) => (
              <div className="col-6 col-md-3" key={index}>
                <div className="gallery-card rounded-4 overflow-hidden shadow-sm">
                  <img src={image} alt={`Gallery ${index + 1}`} className="img-fluid" loading="lazy" onError={handleImageError} />
                  <div className="gallery-overlay">
                    <div>
                      <h5>Our Mission</h5>
                      <p>Protecting the environment for a sustainable future</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
