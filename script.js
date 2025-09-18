// Welcome Animation
document.addEventListener('DOMContentLoaded', () => {
    const welcomeOverlay = document.querySelector('.welcome-overlay');
    const mainContent = document.querySelector('.main-content');
    
    // Hide welcome overlay after animation completes
    setTimeout(() => {
        if (welcomeOverlay) {
            welcomeOverlay.style.display = 'none';
        }
        if (mainContent) {
            mainContent.style.opacity = '1';
            mainContent.classList.add('visible');
        }
    }, 4000); // 4 seconds total (3s animation + 1s buffer)
    
    // Fallback: Ensure content is visible after 5 seconds
    setTimeout(() => {
        if (mainContent) {
            mainContent.style.opacity = '1';
            mainContent.classList.add('visible');
        }
        if (welcomeOverlay) {
            welcomeOverlay.style.display = 'none';
        }
    }, 5000);
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation link highlighting and navbar transparency
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    
    // Handle navbar transparency
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.about-content, .skills-category, .project-card, .timeline-item, .contact-content');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Enhance scroll animations to handle slide-in for skills
window.addEventListener('DOMContentLoaded', () => {
    const skillGrids = document.querySelectorAll('.skills-grid');
    skillGrids.forEach((grid) => {
        const items = grid.querySelectorAll('.skill-item');
        items.forEach((item, idx) => {
            const fromLeft = idx % 2 === 0;
            item.classList.add(fromLeft ? 'slide-in-left' : 'slide-in-right');
            // Stagger transition delay per item for nicer cascade
            item.style.transitionDelay = `${(idx % 6) * 60}ms`;
            observer.observe(item);
        });
    });
});

// Skills section: Effects mode toggle
window.addEventListener('DOMContentLoaded', () => {
    const skillsSection = document.querySelector('#skills');
    const effectsToggle = document.querySelector('#skills-effect-toggle');
    if (!skillsSection || !effectsToggle) return;

    const saved = localStorage.getItem('skillsEffects');
    if (saved === 'on') {
        skillsSection.classList.add('effects-on');
        effectsToggle.checked = true;
    }

    effectsToggle.addEventListener('change', () => {
        if (effectsToggle.checked) {
            skillsSection.classList.add('effects-on');
            localStorage.setItem('skillsEffects', 'on');
        } else {
            skillsSection.classList.remove('effects-on');
            localStorage.setItem('skillsEffects', 'off');
        }
    });
});

// Certificates scroll-in
window.addEventListener('DOMContentLoaded', () => {
    const certCards = document.querySelectorAll('.cert-item');
    certCards.forEach((card, idx) => {
        const fromLeft = idx % 2 === 0;
        card.classList.add(fromLeft ? 'slide-in-left' : 'slide-in-right');
        card.style.transitionDelay = `${(idx % 6) * 60}ms`;
        observer.observe(card);
    });
});

// Contact form handling with EmailJS
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Prepare email data
        const templateParams = {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message,
            to_name: 'Joseph Livingstone',
            to_email: 'josephlivingstone63@gmail.com'
        };
        
        // Send email using EmailJS
        console.log('Sending email with params:', templateParams);
        emailjs.send('service_boe6paq', 'template_v93gy9c', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            }, function(error) {
                console.log('FAILED...', error);
                console.log('Error details:', error);
                showNotification('Failed to send message. Error: ' + error.text, 'error');
            })
            .finally(function() {
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Skills animation on hover
document.querySelectorAll('.skill-item').forEach(skill => {
    skill.addEventListener('mouseenter', function() {
        const skillsSection = document.getElementById('skills');
        const isEffectsOn = skillsSection && skillsSection.classList.contains('effects-on');
        this.style.transform = isEffectsOn ? 'translateY(-6px) scale(1.06)' : 'translateY(-5px) scale(1.05)';
    });
    
    skill.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Project card hover effects
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
        this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
    });
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title[data-typewriter]');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        typeWriter(heroTitle, originalText, 50);
    }

    const aboutTypeTargets = document.querySelectorAll('#about .about-text [data-typewriter]');
    if (aboutTypeTargets.length) {
        let delay = 600; // start after hero typing a bit
        aboutTypeTargets.forEach((el) => {
            const text = el.textContent.trim();
            el.textContent = '';
            setTimeout(() => typeWriter(el, text, 20), delay);
            delay += text.length * 20 + 400; // stagger next paragraph
        });
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});



// Add CSS for active navigation state
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color:rgb(0, 0, 0) !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(style); 

// Theme toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // Add click animation
            themeToggle.style.transform = 'scale(0.95)';
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1)';
            }, 150);
            
            // Toggle theme
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            
            // Add success feedback
            themeToggle.style.transform = 'scale(1.1)';
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1)';
            }, 200);
        });
    }

    // Apply saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
}); 

// Certificates: Lightbox fullscreen preview
window.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('lightbox');
    const content = document.getElementById('lightbox-content');
    const closeBtn = overlay ? overlay.querySelector('.lightbox-close') : null;

    function setLightboxMedia(src, altText) {
        content.innerHTML = '';
        const isPdf = typeof src === 'string' && src.toLowerCase().includes('.pdf');
        if (isPdf) {
            const frame = document.createElement('iframe');
            frame.src = `${src}#toolbar=0&view=FitH&zoom=page-fit`;
            frame.title = altText || 'Certificate document';
            frame.setAttribute('loading', 'lazy');
            frame.style.background = '#111';
            content.appendChild(frame);
        } else {
            const img = document.createElement('img');
            img.src = src;
            img.alt = altText || 'Certificate image';
            img.decoding = 'async';
            img.loading = 'lazy';
            content.appendChild(img);
        }
    }

    function openLightbox(src, altText) {
        if (!overlay || !content) return;
        setLightboxMedia(src, altText);
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!overlay) return;
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        // Defer clearing content slightly for smoother close
        setTimeout(() => { if (content) content.innerHTML = ''; }, 150);
    }

    if (overlay) {
        overlay.addEventListener('click', (evt) => {
            const isOutside = evt.target === overlay;
            const isCloseBtn = evt.target.closest && evt.target.closest('.lightbox-close');
            if (isOutside || isCloseBtn) closeLightbox();
        });
    }
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (evt) => {
        if (evt.key === 'Escape') closeLightbox();
    });

    document.querySelectorAll('.cert-img').forEach((imgEl) => {
        imgEl.style.cursor = 'zoom-in';
        imgEl.addEventListener('click', () => {
            const src = imgEl.getAttribute('src');
            const altText = imgEl.getAttribute('alt') || '';
            if (!src) return;
            openLightbox(src, altText);
        });
    });
}); 

// Certificates: Horizontal scroll interactions (wheel + drag)
window.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.cert-grid');
    if (!grid) return;

    // Smooth wheel: convert vertical wheel to horizontal scroll
    grid.addEventListener('wheel', (evt) => {
        const isTrackpadHorizontal = Math.abs(evt.deltaX) > Math.abs(evt.deltaY);
        if (isTrackpadHorizontal) return; // allow natural horizontal
        if (evt.deltaY === 0) return;
        evt.preventDefault();
        grid.scrollBy({ left: evt.deltaY * 1.1, behavior: 'smooth' });
    }, { passive: false });

    // Click-drag scrolling
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let dragged = false;

    const onMouseDown = (e) => {
        isDown = true;
        dragged = false;
        grid.classList.add('dragging');
        startX = e.pageX - grid.offsetLeft;
        scrollLeft = grid.scrollLeft;
    };
    const onMouseLeave = () => { isDown = false; grid.classList.remove('dragging'); };
    const onMouseUp = () => { isDown = false; grid.classList.remove('dragging'); };
    const onMouseMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - grid.offsetLeft;
        const walk = (x - startX) * 1.2;
        if (Math.abs(walk) > 6) dragged = true; // threshold to suppress click
        grid.scrollLeft = scrollLeft - walk;
    };

    grid.addEventListener('mousedown', onMouseDown);
    grid.addEventListener('mouseleave', onMouseLeave);
    grid.addEventListener('mouseup', onMouseUp);
    grid.addEventListener('mousemove', onMouseMove);

    // Suppress click on images if a drag happened, so lightbox doesn't open unintentionally
    grid.querySelectorAll('.cert-img').forEach((img) => {
        img.addEventListener('click', (e) => {
            if (dragged) {
                e.stopPropagation();
                e.preventDefault();
                dragged = false;
            }
        });
    });
}); 
// Back to Top button functionality
document.addEventListener('DOMContentLoaded', () => {
    const backToTopBtn = document.getElementById("backToTop");
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
            backToTopBtn.style.opacity = '1';
        } else {
            backToTopBtn.style.opacity = '0';
            setTimeout(() => {
                if (backToTopBtn.style.opacity === '0') {
                    backToTopBtn.style.display = 'none';
                }
            }, 300);
        }
    });
    
    // Smooth scroll to top
    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Certificate tabs functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked button and target pane
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Certificate scroll functionality
    const scrollArrows = document.querySelectorAll('.scroll-arrow');
    
    scrollArrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            const container = arrow.closest('.cert-scroll-container');
            const grid = container.querySelector('.certificates-grid');
            const scrollAmount = 400; // Scroll by 400px
            
            if (arrow.classList.contains('scroll-left')) {
                grid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else if (arrow.classList.contains('scroll-right')) {
                grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        });
    });

    // Touch/swipe support for mobile
    let isDown = false;
    let startX;
    let scrollLeft;

    const certificateGrids = document.querySelectorAll('.certificates-grid');
    
    certificateGrids.forEach(grid => {
        grid.addEventListener('mousedown', (e) => {
            isDown = true;
            grid.style.cursor = 'grabbing';
            startX = e.pageX - grid.offsetLeft;
            scrollLeft = grid.scrollLeft;
        });

        grid.addEventListener('mouseleave', () => {
            isDown = false;
            grid.style.cursor = 'grab';
        });

        grid.addEventListener('mouseup', () => {
            isDown = false;
            grid.style.cursor = 'grab';
        });

        grid.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - grid.offsetLeft;
            const walk = (x - startX) * 2;
            grid.scrollLeft = scrollLeft - walk;
        });
    });

    // Coordination navigation links
    const coordinationLinks = document.querySelectorAll('.coordination-link');
    coordinationLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetSection = link.getAttribute('data-section');
            const targetElement = document.getElementById(targetSection);
            
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Feature buttons functionality
    const downloadResumeBtn = document.getElementById('downloadResume');
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', () => {
            // Trigger resume download
            const resumeLink = document.createElement('a');
            resumeLink.href = 'assets/KAMIDI LIVINGSTAN JOSEPH Resume.pdf';
            resumeLink.download = 'Kamidi_Livingstan_Joseph_Resume.pdf';
            resumeLink.click();
        });
    }

    // Scroll to Top Button functionality
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
    
    // Smooth scroll to top when clicked
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
