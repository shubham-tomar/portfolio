document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  
  gsap.registerPlugin(ScrollTrigger);
  
  const sections = [
    { id: 'hero', start: 'top 80%' },
    { id: 'journey-timeline', start: 'top 75%' },
    { id: 'projects-section', start: 'top 75%' },
    { id: 'blogs-section', start: 'top 75%' }
  ];

  function initSectionAnimation(section) {
    const element = document.getElementById(section.id);
    if (!element) return;
    
    if (section.id === 'hero') {
      const textElements = element.querySelectorAll('h1, p');
      gsap.fromTo(textElements, 
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.2, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: element, start: section.start, once: true }
        }
      );
    } else if (section.id === 'journey-timeline') {
      const container = document.getElementById('timeline-container');
      if (container) {
        gsap.fromTo(container,
          { y: 40, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power1.out',
            scrollTrigger: { trigger: element, start: section.start, once: true }
          }
        );
      }
    } else {
      const heading = element.querySelector('h2');
      const container = element.querySelector('[id$="-container"]');
      
      gsap.fromTo(heading,
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.5,
          scrollTrigger: { trigger: element, start: section.start, once: true }
        }
      );
      
      if (container) {
        const observer = new MutationObserver(mutations => {
          for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
              const children = Array.from(container.children);
              if (children.length) {
                gsap.fromTo(children,
                  { y: 30, autoAlpha: 0 },
                  { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.5, ease: 'power2.out',
                    scrollTrigger: { trigger: container, start: section.start, once: true }
                  }
                );
              }
              observer.disconnect();
              break;
            }
          }
        });
        
        observer.observe(container, { childList: true });
      }
    }
  }

  setTimeout(() => sections.forEach(initSectionAnimation), 100);
});
