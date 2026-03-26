(() => {
    'use strict'
  
    // --- Bootstrap Form Validation ---
    const forms = document.querySelectorAll('.needs-validation')
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
        form.classList.add('was-validated')
      }, false)
    })

    // --- Navbar scroll shadow ---
    const navbar = document.getElementById('mainNav')
    if (navbar) {
      const onScroll = () => {
        if (window.scrollY > 10) {
          navbar.classList.add('scrolled')
        } else {
          navbar.classList.remove('scrolled')
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
    }

    // --- Scroll-to-top button ---
    const scrollTopBtn = document.getElementById('scrollTopBtn')
    if (scrollTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
          scrollTopBtn.classList.add('visible')
        } else {
          scrollTopBtn.classList.remove('visible')
        }
      }, { passive: true })

      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    }

    // --- Close mobile nav on link click ---
    const navCollapse = document.getElementById('navbarNavAltMarkup')
    if (navCollapse) {
      const navLinks = navCollapse.querySelectorAll('.nav-link:not(.dropdown-toggle)')
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          const bsCollapse = bootstrap.Collapse.getInstance(navCollapse)
          if (bsCollapse) {
            bsCollapse.hide()
          }
        })
      })
    }

    // --- Active filter highlight ---
    const filters = document.querySelectorAll('.filter')
    filters.forEach(filter => {
      filter.addEventListener('click', () => {
        filters.forEach(f => f.classList.remove('active'))
        filter.classList.add('active')
      })
    })

    // --- Image lazy loading intersection observer ---
    if ('IntersectionObserver' in window) {
      const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1'
            imgObserver.unobserve(entry.target)
          }
        })
      }, { threshold: 0.1 })

      document.querySelectorAll('.listing-card-img').forEach(img => {
        img.style.opacity = '0'
        img.style.transition = 'opacity 0.4s ease'
        if (img.complete) {
          img.style.opacity = '1'
        } else {
          imgObserver.observe(img)
          img.addEventListener('load', () => {
            img.style.opacity = '1'
          })
        }
      })
    }
  })()