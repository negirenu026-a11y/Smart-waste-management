import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Events() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const eventsPerSlide = 3

  const events = [
    {
      title: 'Community Cleanup Day',
      date: 'June 14, 2026',
      location: 'Riverfront Park',
      description: 'Join volunteers to collect debris and restore the river shoreline.',
      image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Forest Teaching Workshop',
      date: 'July 18, 2026',
      location: 'Green Village Center',
      description: 'Learn practical conservation techniques from local experts.',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Youth Climate Rally',
      date: 'August 6, 2026',
      location: 'City Square',
      description: 'Speak up for climate solutions with youth leaders and activists.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Ocean Cleanup Drive',
      date: 'September 12, 2026',
      location: 'Coastal Beach',
      description: 'Help remove plastic waste from beaches and marine habitats.',
      image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Wildlife Rescue Training',
      date: 'October 5, 2026',
      location: 'Nature Reserve Center',
      description: 'Learn techniques to help injured animals and restore habitats.',
      image: 'https://images.unsplash.com/photo-1426604966848-d7bcdd5735a9?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Tree Planting Festival',
      date: 'November 10, 2026',
      location: 'Urban Forest Park',
      description: 'Plant thousands of native trees and help restore urban green spaces.',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Renewable Energy Expo',
      date: 'December 1, 2026',
      location: 'Convention Center',
      description: 'Explore clean energy solutions and sustainable technology innovations.',
      image: 'https://images.unsplash.com/photo-1509391366360-2e938aa1ef14?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Community Garden Workshop',
      date: 'January 15, 2027',
      location: 'Downtown Community Center',
      description: 'Start your own garden and learn sustainable farming practices.',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=500&q=80',
    },
  ]

  const totalSlides = Math.ceil(events.length / eventsPerSlide)

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

  const displayedEvents = events.slice(
    currentSlide * eventsPerSlide,
    currentSlide * eventsPerSlide + eventsPerSlide
  )

  return (
    <section className="section py-5">
      <div className="container">
        <div className="section-heading text-center mb-5">
          <span className="eyebrow text-brand">Events</span>
          <h2 className="fw-bold">Upcoming activities and gatherings</h2>
          <p className="text-secondary mx-auto" style={{ maxWidth: '700px' }}>
            Attend our events to learn how you can help and meet other changemakers.
          </p>
        </div>

        {/* Events Carousel */}
        <div className="position-relative">
          <div 
            className="row g-4"
            style={{
              transition: 'opacity 0.5s ease-in-out',
              opacity: 1,
            }}
          >
            {displayedEvents.map((event) => (
              <div className="col-md-6 col-lg-4" key={event.title}>
                <div className="card event-card h-100 rounded-4 shadow-sm border-0 overflow-hidden">
                  {/* Event Image */}
                  <img
                    src={event.image}
                    alt={event.title}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  {/* Event Content */}
                  <div className="card-body p-4">
                    <div className="mb-3 text-brand fw-semibold">{event.date}</div>
                    <h5 className="card-title">{event.title}</h5>
                    <p className="text-secondary mb-1">{event.location}</p>
                    <p className="text-secondary mb-3">{event.description}</p>
                    <Link className="btn btn-sm btn-outline-brand" to="/contact">
                      Reserve a spot
                    </Link>
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

export default Events
