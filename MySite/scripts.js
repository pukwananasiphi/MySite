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
  
 
  // Helper function to validate email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


// Initialize EmailJS with your public key
(function() {
    emailjs.init("oNg-oQJSs6vc4ZuT_"); // Replace with your EmailJS public key
})();

// Add event listener to the form
document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    // Send the form using EmailJS
    emailjs.sendForm("service_0uui6ru", "template_5ozwb1s", this)
        .then(function() {
            alert("Thanks for reaching out.I'll get back to you soon!");
        }, function(error) {
            alert("Failed to send message. Please try again.");
            console.error("EmailJS error:", error);
        });
});

 const currentLocation = window.location.pathname;
const navLinks = document.querySelectorAll('.nav-menu a');

navLinks.forEach(link => {
  const linkPath = new URL(link.href).pathname;

  if (
    currentLocation === linkPath ||
    (currentLocation === '/' && linkPath.endsWith('/index.html')) ||
    (currentLocation.includes(linkPath) && linkPath !== '/')
  ) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});

});