/**
 * GSAP Scroll Animations
 * Modern and stylish animations triggered on scroll
 */

// Check if GSAP and ScrollTrigger are available
function checkGSAPDependencies() {
  if (typeof gsap === 'undefined') {
    console.warn('GSAP library not loaded. Animations will be disabled.');
    return false;
  }

  // Check for ScrollTrigger plugin
  if (typeof gsap.registerPlugin === 'function' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    return true;
  } else {
    console.warn('ScrollTrigger plugin not available. Using basic animations instead.');
    // We can still use basic GSAP without ScrollTrigger
    return true;
  }
}

// Initialize GSAP animations
export function initGSAPAnimations() {
  if (!checkGSAPDependencies()) return;

  // Add a small delay to ensure DOM elements are fully loaded
  setTimeout(() => {
    animateHeroSection();
    animateContentSections();
    animateProjectsAndBlogs();
    animateTimelineSection();
  }, 200);
}

// Hero section animations
function animateHeroSection() {
  const heroSection = document.querySelector('.hero-section');
  if (!heroSection) return;

  const profileImage = heroSection.querySelector('.profile-image-container');
  const socialIcons = heroSection.querySelectorAll('.social-icon');
  const heroText = heroSection.querySelector('h1');
  const heroParagraph = heroSection.querySelector('p');
  const heroButton = heroSection.querySelector('a.btn');

  // Create a timeline for hero section
  const tlHero = gsap.timeline();

  // Profile image animation
  if (profileImage) {
    gsap.set(profileImage, { opacity: 0, scale: 0.8 });

    tlHero.to(profileImage, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "back.out(1.7)"
    });
  }

  // Social icons animation
  if (socialIcons.length) {
    gsap.set(socialIcons, { opacity: 0, scale: 0 });

    tlHero.to(socialIcons, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "back.out(2)"
    }, "-=0.5");
  }

  // Text animations
  if (heroText) {
    gsap.set(heroText, { opacity: 0, y: 30 });
    tlHero.to(heroText, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.7");
  }

  if (heroParagraph) {
    gsap.set(heroParagraph, { opacity: 0, y: 20 });
    tlHero.to(heroParagraph, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.6");
  }

  if (heroButton) {
    gsap.set(heroButton, { opacity: 0, y: 20 });
    tlHero.to(heroButton, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.6");
  }
}

// Content sections animations
function animateContentSections() {
  const sections = document.querySelectorAll('section');

  sections.forEach(section => {
    if (section.classList.contains('hero-section')) return; // Skip hero section

    const heading = section.querySelector('h2, h1');
    const content = section.querySelectorAll('p, .content');

    if (heading) {
      gsap.set(heading, { opacity: 0, y: 30 });

      gsap.to(heading, {
        scrollTrigger: {
          trigger: heading,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      });
    }

    if (content.length) {
      gsap.set(content, { opacity: 0, y: 30 });

      gsap.to(content, {
        scrollTrigger: {
          trigger: content[0],
          start: "top 80%",
          toggleActions: "play none none none"
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      });
    }
  });
}

// Projects and blogs animations
function animateProjectsAndBlogs() {
  // Projects
  const projectsContainer = document.getElementById('projects-container') || document.getElementById('projects-grid');
  if (projectsContainer) {
    const projects = projectsContainer.children;

    gsap.set(projects, { opacity: 0, y: 50 });

    gsap.to(projects, {
      scrollTrigger: {
        trigger: projectsContainer,
        start: "top 80%",
        toggleActions: "play none none none"
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out"
    });
  }

  // Blogs
  const blogsContainer = document.getElementById('blogs-container') || document.getElementById('blog-container');
  if (blogsContainer) {
    const blogs = blogsContainer.children;

    gsap.set(blogs, { opacity: 0, y: 50 });

    gsap.to(blogs, {
      scrollTrigger: {
        trigger: blogsContainer,
        start: "top 80%",
        toggleActions: "play none none none"
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out"
    });
  }
}

// Timeline section animations
function animateTimelineSection() {
  const timelineSection = document.querySelector('.timeline-section');
  if (!timelineSection) return;

  // Mobile timeline events
  const mobileTimelineEvents = timelineSection.querySelectorAll('.md\\:hidden .relative');
  if (mobileTimelineEvents.length) {
    gsap.set(mobileTimelineEvents, { opacity: 0, x: -50 });

    mobileTimelineEvents.forEach(event => {
      gsap.to(event, {
        scrollTrigger: {
          trigger: event,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power3.out"
      });
    });
  }

  // Desktop timeline events
  const desktopTimelineEvents = timelineSection.querySelectorAll('.hidden.md\\:block .absolute');
  if (desktopTimelineEvents.length) {
    gsap.set(desktopTimelineEvents, { opacity: 0, y: 30 });

    desktopTimelineEvents.forEach(event => {
      gsap.to(event, {
        scrollTrigger: {
          trigger: event,
          start: "top 90%",
          toggleActions: "play none none none"
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      });
    });
  }

  // Timeline line animation
  const timelineLine = timelineSection.querySelector('.bg-gradient-to-b, .bg-gradient-to-r');
  if (timelineLine) {
    gsap.set(timelineLine, {
      scaleY: 0,
      transformOrigin: "top center"
    });

    gsap.to(timelineLine, {
      scrollTrigger: {
        trigger: timelineLine,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1
      },
      scaleY: 1,
      duration: 1,
      ease: "power3.out"
    });
  }
}

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', initGSAPAnimations);

// Re-initialize animations when content is loaded dynamically
document.addEventListener('contentLoaded', initGSAPAnimations);
