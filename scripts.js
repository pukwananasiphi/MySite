// Main JavaScript file for Nasiphi Pukwana's Portfolio

document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
  }
  
  // Back to Top Button
  const backToTopBtn = document.querySelector('.back-to-top');
  
  if (backToTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });
    
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Scroll Animations
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  function checkReveal() {
    for (let i = 0; i < revealElements.length; i++) {
      const windowHeight = window.innerHeight;
      const elementTop = revealElements[i].getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < windowHeight - elementVisible) {
        revealElements[i].classList.add('active');
      }
    }
  }
  
  window.addEventListener('scroll', checkReveal);
  checkReveal();
  
  // Animated Skills
  const animateSkills = function() {
    const skills = document.querySelectorAll('.animated-skill');
    
    skills.forEach(skill => {
      const percentage = skill.getAttribute('data-percentage');
      const bar = skill.querySelector('.skill-bar');
      
      if (bar) {
        setTimeout(() => {
          bar.style.width = percentage + '%';
        }, 300);
      }
    });
  };
  
  animateSkills();
  
  // Image Slideshow
  const slideshow = document.querySelector('.slideshow');
  
  if (slideshow) {
    const slides = slideshow.querySelectorAll('.slide');
    let currentSlide = 0;
    
    // Hide all slides except the first one
    for (let i = 1; i < slides.length; i++) {
      slides[i].style.display = 'none';
    }
    
    // Function to switch slides
    function nextSlide() {
      slides[currentSlide].style.display = 'none';
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].style.display = 'block';
    }
    
    // Set interval for slideshow
    setInterval(nextSlide, 3000);
  }
  
  // Form Validation
  const contactForm = document.querySelector('#contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Basic validation
      let valid = true;
      const nameInput = document.querySelector('#name');
      const emailInput = document.querySelector('#email');
      const messageInput = document.querySelector('#message');
      
      if (nameInput.value.trim() === '') {
        valid = false;
        nameInput.classList.add('error');
      } else {
        nameInput.classList.remove('error');
      }
      
      if (emailInput.value.trim() === '' || !isValidEmail(emailInput.value)) {
        valid = false;
        emailInput.classList.add('error');
      } else {
        emailInput.classList.remove('error');
      }
      
      if (messageInput.value.trim() === '') {
        valid = false;
        messageInput.classList.add('error');
      } else {
        messageInput.classList.remove('error');
      }
      
      if (valid) {
        // In a real application, you would send the form data to a server here
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
      } else {
        alert('Please fill in all required fields correctly.');
      }
    });
  }
  
  // Helper function to validate email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Active Nav Link
  const currentLocation = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-menu a');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    
    if (currentLocation === linkPath || 
        (currentLocation === '/' && linkPath === '/index.html') ||
        (currentLocation.includes(linkPath) && linkPath !== '/')) {
      link.classList.add('active');
    }
  });
});