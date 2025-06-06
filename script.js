// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);


// Select all sections
const sections = document.querySelectorAll('.section');

sections.forEach((section) => {
  // Animate the heading
  gsap.fromTo(
    section.querySelector('h1'),
    {
      opacity: 0,
      y: 50,
      scale: 0.8,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top center+=100',
        toggleActions: 'play none none reverse',
      },
    }
  );

  // Animate the paragraph
  gsap.fromTo(
    section.querySelector('p'),
    {
      opacity: 0,
      y: 50,
    },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.3,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top center+=100',
        toggleActions: 'play none none reverse',
      },
    }
  );
});

// Animate experience items
gsap.utils.toArray('.experience-item').forEach((item) => {
  gsap.from(item, {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: item,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });
});

// Animate education items
gsap.utils.toArray('.education-item').forEach((item) => {
  gsap.from(item, {
    opacity: 0,
    x: -50,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: item,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });
});

// Animate project items
gsap.utils.toArray('.project-item').forEach((item) => {
  gsap.from(item, {
    opacity: 0,
    scale: 0.8,
    duration: 1,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: item,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });
});

// Animate certifications list
gsap.from('.certifications-section ul li', {
  opacity: 0,
  y: 20,
  duration: 0.6,
  stagger: 0.2,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.certifications-section',
    start: 'top 80%',
    toggleActions: 'play none none reverse',
  },
});

// Animate skill categories
gsap.utils.toArray('.skill-category').forEach((category, index) => {
  gsap.from(category, {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: index * 0.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: category,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  });
});

// Animate contact details
gsap.from('.contact-details p', {
  opacity: 0,
  x: -30,
  duration: 0.8,
  stagger: 0.2,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.contact-details',
    start: 'top 85%',
    toggleActions: 'play none none reverse',
  },
});

// ScrollSpy to highlight active navigation link
sections.forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top center',
    end: 'bottom center',
    onEnter: () => setActiveLink(section.id),
    onEnterBack: () => setActiveLink(section.id),
  });
});

function setActiveLink(id) {
  document.querySelectorAll('nav .nav-links a').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
  });
}


const expandButtons = document.querySelectorAll('.expand-btn');

expandButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const courseList = button.nextElementSibling;
    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    // Toggle the visibility
    courseList.hidden = isExpanded ? true : false;
    button.setAttribute('aria-expanded', !isExpanded);

    // Optionally, scroll to the expanded content
    if (!isExpanded) {
      gsap.to(window, { duration: 0.5, scrollTo: courseList, offsetY: 70 });
    }
  });
});

// Existing GSAP animations and other scripts...

document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.carousel');
  const cards = document.querySelectorAll('.carousel-card');
  const dots = document.querySelectorAll('.carousel-nav .dot');
  let currentIndex = 0;
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID;
  
  // Get the width of the carousel container
  let carouselWidth = document.querySelector('.carousel-container').offsetWidth;

  // Update the carousel width on window resize
  window.addEventListener('resize', () => {
    carouselWidth = document.querySelector('.carousel-container').offsetWidth;
    setPositionByIndex();
  });

  // Touch and Mouse events
  carousel.addEventListener('touchstart', touchStart);
  carousel.addEventListener('touchend', touchEnd);
  carousel.addEventListener('touchmove', touchMove);

  carousel.addEventListener('mousedown', touchStart);
  carousel.addEventListener('mouseup', touchEnd);
  carousel.addEventListener('mouseleave', touchEnd);
  carousel.addEventListener('mousemove', touchMove);

  // Prevent default image drag behavior
  carousel.addEventListener('dragstart', (e) => e.preventDefault());

  // Click event for navigation dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      setPositionByIndex();
      updateActiveDot();
    });
  });

  function touchStart(event) {
    isDragging = true;
    startPos = getPositionX(event);
    animationID = requestAnimationFrame(animation);
    carousel.classList.add('grabbing');
  }

  function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);

    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -carouselWidth / 4 && currentIndex < cards.length - 1) currentIndex += 1;
    if (movedBy > carouselWidth / 4 && currentIndex > 0) currentIndex -= 1;

    setPositionByIndex();
    updateActiveDot();

    carousel.classList.remove('grabbing');
  }

  function touchMove(event) {
    if (isDragging) {
      const currentPosition = getPositionX(event);
      currentTranslate = prevTranslate + currentPosition - startPos;
    }
  }

  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }

  function animation() {
    setSliderPosition();
    if (isDragging) requestAnimationFrame(animation);
  }

  function setSliderPosition() {
    carousel.style.transform = `translateX(${currentTranslate}px)`;
  }

  function setPositionByIndex() {
    currentTranslate = -currentIndex * carouselWidth;
    prevTranslate = currentTranslate;
    setSliderPosition();
  }

  function updateActiveDot() {
    dots.forEach((dot) => dot.classList.remove('active'));
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');
  }

  // Initialize the carousel position
  setPositionByIndex();
  updateActiveDot();
});

// Existing GSAP animations and other scripts...

// Hamburger Menu Toggle
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('nav-active');
  // Animate Links
  navLinks.querySelectorAll('li').forEach((link, index) => {
    if (link.style.animation) {
      link.style.animation = '';
    } else {
      link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
    }
  });
  // Burger Animation
  burger.classList.toggle('toggle');
});

// Optional: Close menu when a link is clicked
navLinks.addEventListener('click', () => {
  if (navLinks.classList.contains('nav-active')) {
    navLinks.classList.remove('nav-active');
    burger.classList.remove('toggle');
    navLinks.querySelectorAll('li').forEach((link) => {
      link.style.animation = '';
    });
  }
});


// GSAP ribbon-style cursor trail
document.addEventListener('DOMContentLoaded', () => {
  const trail = document.querySelector('.cursor-ribbon');

  const coords = { x: 0, y: 0 };
  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  gsap.set(trail, {
    xPercent: -50,
    yPercent: -50,
  });

  window.addEventListener('mousemove', (e) => {
    coords.x = e.clientX;
    coords.y = e.clientY;
  });

  gsap.ticker.add(() => {
    pos.x += (coords.x - pos.x) * 0.15;
    pos.y += (coords.y - pos.y) * 0.15;
    gsap.set(trail, {
      x: pos.x,
      y: pos.y,
    });
  });
    // Fading particles behind the ribbon
    setInterval(() => {
      const particle = document.createElement('div');
      particle.className = 'ribbon-particle';
      particle.style.left = `${pos.x}px`;
      particle.style.top = `${pos.y}px`;
      document.body.appendChild(particle);
  
      // Optional size & glow randomization
      const size = Math.random() * 4 + 4;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.filter = `blur(${Math.random() * 2}px)`;
  
      setTimeout(() => {
        particle.remove();
      }, 600);
    }, 40); // Adjust for more/less trail density
});