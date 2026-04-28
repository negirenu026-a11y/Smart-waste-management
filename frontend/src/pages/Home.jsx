import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { handleImageError } from '../utils/imageFallback.js'
import CityDataDisplay from '../components/CityDataDisplay';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [statsCount, setStatsCount] = useState({ projects: 0, volunteers: 0, people: 0, awards: 0 })
  const [statsStarted, setStatsStarted] = useState(false)
  const statsRef = useRef(null)
  
  const services = [
    {
      title: 'Waste Collection',
      description: 'Efficient door-to-door garbage collection ensuring cleanliness across all zones.',
      icon: 'bi-truck',
      image: '/img/service-1.jpg'
    },
    {
      title: 'Recycling Management',
      description: 'Smart segregation and recycling system for plastic, organic, and hazardous waste.',
      icon: 'bi-recycle',
      image: '/img/service-2.jpg'
    },
    {
      title: 'Smart Monitoring',
      description: 'Real-time tracking of waste levels and worker activities using smart technology.',
      icon: 'bi-cpu',
      image: '/img/service-3.jpg'
    },
    {
      title: 'Public Awareness',
      description: 'Educating citizens about proper waste disposal and environmental responsibility.',
      icon: 'bi-megaphone',
      image: '/img/service-4.jpg'
    },
  ]

  const serviceImages = [
    '/img/service-1.jpg',
    '/img/service-2.jpg',
    '/img/service-3.jpg',
    '/img/service-4.jpg',
  ]

  const causes = [
    {
      title: 'Garbage Cleanup Drive',
      text: 'Organizing massive cleanup drives in urban areas to ensure a cleaner and healthier environment.',
      image: '/img/causes-1.jpg',
    },
    {
      title: 'Plastic Free Campaign',
      text: 'Promoting the reduction of single-use plastics and encouraging sustainable alternatives.',
      image: '/img/causes-2.jpg',
    },
    {
      title: 'Smart Waste Bins',
      text: 'Deploying IoT-enabled smart bins across the city for optimized waste collection routes.',
      image: '/img/causes-3.jpg',
    },
  ]

  const galleryImages = [
    { src: '/img/gallery-1.jpg', title: 'Community Cleanup' },
    { src: '/img/gallery-2.jpg', title: 'Plastic Recycling' },
    { src: '/img/gallery-3.jpg', title: 'Green City Vision' },
    { src: '/img/gallery-4.jpg', title: 'Smart Monitoring' },
  ]

  const heroSlides = [
    {
      image: '/img/carousel-1.jpg',
      title: 'Smart Waste Management',
      subtitle: 'Cleaner Cities, Brighter Future',
      description: 'Join our mission to restore ecosystems, support communities, and inspire change with practical waste management programs.'
    },
    {
      image: '/img/carousel-2.jpg',
      title: 'Efficient Recycling',
      subtitle: 'Zero Waste Vision',
      description: 'Transforming waste into resources through advanced segregation and recycling technology.'
    },
    {
      image: '/img/carousel-3.jpg',
      title: 'Public Awareness',
      subtitle: 'Join the Movement',
      description: 'Empowering citizens to take responsibility for their environment through education and action.'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsStarted) {
          setStatsStarted(true)
          const duration = 2000 
          const startTime = Date.now()
          
          const animateCounters = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const easeProgress = 1 - Math.pow(1 - progress, 3)
            
            setStatsCount({
              projects: Math.floor(120 * easeProgress),
              volunteers: Math.floor(24 * easeProgress),
              people: Math.floor(35 * easeProgress),
              awards: Math.floor(8 * easeProgress),
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

  return (
    <>
      <style>{`
        .gallery-item {
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        .gallery-img {
          transition: transform 0.5s ease;
          width: 100%;
          height: 250px;
          object-fit: cover;
        }
        .gallery-item:hover .gallery-img {
          transform: scale(1.15);
        }
        .gallery-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(31, 92, 65, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .gallery-item:hover .gallery-overlay {
          opacity: 1;
        }

        /* Horizontal Continuous Scrolling Styles */
        .scrolling-wrapper {
          overflow: hidden;
          width: 100%;
          position: relative;
          padding: 40px 0;
        }
        .scrolling-content {
          display: flex;
          width: calc(250px * 8);
          animation: scroll 20s linear infinite;
        }
        .scrolling-content:hover {
          animation-play-state: paused;
        }
        .scrolling-item {
          width: 250px;
          height: 200px;
          flex-shrink: 0;
          padding: 0 10px;
        }
        .scrolling-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-250px * 4)); }
        }
      `}</style>

      {/* Hero Carousel Section - Fixed Header spacing is handled by MainLayout's .page-main class */}
      <section className="hero-section position-relative text-white overflow-hidden" style={{ height: '80vh' }}>
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
              <div className="carousel-overlay position-absolute w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}></div>
              <div className="carousel-content d-flex align-items-center h-100 position-relative" style={{ zIndex: 2 }}>
                <div className="container">
                  <div className="row justify-content-center">
                    <div className="col-lg-8 text-center">
                      <span className="eyebrow d-block mb-3 text-warning">{slide.subtitle}</span>
                      <h1 className="display-4 fw-bold mb-3">{slide.title}</h1>
                      <p className="lead text-white-75 mb-4">{slide.description}</p>
                      <div className="d-flex flex-wrap gap-3 justify-content-center">
                        <Link className="btn btn-warning btn-lg text-dark" to="/about">Learn More</Link>
                        <Link className="btn btn-outline-light btn-lg" to="/contact">Contact Us</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section with Continuous Horizontal Slider */}
      <section className="section bg-light py-5">
        <div className="container py-5">
          <div className="section-heading text-center mb-5">
            <span className="eyebrow text-brand">What we do</span>
            <h2 className="fw-bold">How we protect environment</h2>
          </div>
          
          <div className="scrolling-wrapper">
            <div className="scrolling-content">
              {[...serviceImages, ...serviceImages].map((img, index) => (
                <div className="scrolling-item" key={index}>
                  <img src={img} alt={`Service ${index}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="row g-4 mt-5">
            {services.map((service, index) => (
              <div className="col-md-6 col-lg-3" key={index}>
                <div className="card h-100 border-0 shadow-sm rounded-4 p-4 bg-white text-center">
                  <div className="icon-box rounded-circle mx-auto mb-3 bg-primary text-white" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={`bi ${service.icon} fs-3`}></i>
                  </div>
                  <h5 className="fw-bold">{service.title}</h5>
                  <p className="text-secondary small mb-0">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Counter Section */}
      <section className="section bg-dark text-white py-5" ref={statsRef}>
        <div className="container">
          <div className="row gy-4 text-center">
            <div className="col-6 col-md-3">
              <h3 className="display-6 fw-bold mb-1">{statsCount.projects}+</h3>
              <p className="mb-0 text-white-75">Projects Completed</p>
            </div>
            <div className="col-6 col-md-3">
              <h3 className="display-6 fw-bold mb-1">{statsCount.volunteers}/7</h3>
              <p className="mb-0 text-white-75">Volunteer Support</p>
            </div>
            <div className="col-6 col-md-3">
              <h3 className="display-6 fw-bold mb-1">{statsCount.people}K</h3>
              <p className="mb-0 text-white-75">People Helped</p>
            </div>
            <div className="col-6 col-md-3">
              <h3 className="display-6 fw-bold mb-1">{statsCount.awards}</h3>
              <p className="mb-0 text-white-75">Awards Won</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section py-5">
        <div className="container py-5">
          <div className="section-heading text-center mb-5">
            <span className="eyebrow text-brand">Gallery</span>
            <h2 className="fw-bold">Moments for our mission</h2>
          </div>
          <div className="row g-4">
            {galleryImages.map((image, index) => (
              <div className="col-6 col-lg-3" key={index}>
                <div className="gallery-item rounded-4 shadow-sm">
                  <img src={image.src} className="gallery-img" alt={image.title} />
                  <div className="gallery-overlay">
                    <h5 className="text-white mb-0">{image.title}</h5>
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
