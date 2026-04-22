#!/usr/bin/env python3
import re

# Read the file
with open('src/pages/Home.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the old hero section
old_hero = '''      <section className="hero-section py-5 text-white overflow-hidden">
        <div className="container">
          <div className="row align-items-center gy-4">
            <div className="col-lg-6">
              <span className="eyebrow">We'll save our planet</span>
              <h1 className="display-5 fw-bold">
                Protect Environment, Protect Future
              </h1>
              <p className="lead text-white-75">
                Join our mission to restore ecosystems, support communities, and
                inspire change with practical environmental programs.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <a className="btn btn-warning btn-lg text-dark" href="#about">
                  Learn More
                </a>
                <Link className="btn btn-outline-light btn-lg" to="/contact">
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-card bg-white rounded-4 shadow-lg p-4">
                <img
                  src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1100&q=80"
                  className="img-fluid rounded-4"
                  alt="Nature"
                  loading="lazy"
                  onError={handleImageError}
                />
              </div>
            </div>
          </div>
        </div>
      </section>'''

new_hero = '''      {/* Hero Carousel Section with Background Images */}
      <section className="hero-carousel-section">
        <div className="carousel-container">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: index === currentSlide ? 1 : 0,
              }}
            >
              {/* Dark overlay for text readability */}
              <div className="carousel-overlay"></div>
              
              {/* Text content on top of image */}
              <div className="carousel-content">
                <div className="container">
                  <div className="carousel-text">
                    <span className="carousel-eyebrow">{slide.subtitle}</span>
                    <h1 className="carousel-title">{slide.title}</h1>
                    <p className="carousel-description">{slide.description}</p>
                    <div className="d-flex flex-wrap gap-3 mt-4">
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
          ))}

          {/* Carousel Controls - Previous Button */}
          <button 
            className="carousel-control carousel-control-prev"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <span className="carousel-control-icon">‹</span>
          </button>

          {/* Carousel Controls - Next Button */}
          <button 
            className="carousel-control carousel-control-next"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <span className="carousel-control-icon">›</span>
          </button>

          {/* Carousel Indicators/Dots */}
          <div className="carousel-indicators">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </section>'''

# Replace in content
content = content.replace(old_hero, new_hero)

# Write back
with open('src/pages/Home.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('✓ Successfully replaced hero section with carousel!')
