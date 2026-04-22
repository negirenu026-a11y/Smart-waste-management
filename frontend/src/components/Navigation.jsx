import { NavLink } from 'react-router-dom'

function Navigation() {
  return (
    <header className="site-header sticky-top shadow-sm">
      <nav className="navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <NavLink className="navbar-brand fw-bold text-brand" to="/">
            Environs
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navMenu"
            aria-controls="navMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav ms-auto align-items-center">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About' },
                { to: '/services', label: 'Services' },
                { to: '/causes', label: 'Causes' },
                { to: '/events', label: 'Events' },
                { to: '/gallery', label: 'Gallery' },
                { to: '/blog', label: 'Blog' },
                { to: '/donation', label: 'Donation' },
                { to: '/volunteer', label: 'Volunteer' },
                { to: '/contact', label: 'Contact' },
              ].map((item) => (
                <li className="nav-item px-1" key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      isActive ? 'nav-link active' : 'nav-link'
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="ms-lg-3 mt-3 mt-lg-0">
              <NavLink to="/auth" className="btn btn-primary px-4 fw-bold rounded-pill">
                Sign Up
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navigation
