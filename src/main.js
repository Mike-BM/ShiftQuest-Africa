import './style.css'

// Animated number counters
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll('.count-up');
  const speed = 200; // lower is slower

  const animateCounters = () => {
    counters.forEach(counter => {
      const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const inc = target / speed;

        if (count < target) {
          counter.innerText = Math.ceil(count + inc);
          setTimeout(updateCount, 10);
        } else {
          counter.innerText = target;
        }
      };
      updateCount();
    });
  };

  // Intersection Observer to trigger counting when in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const impactSection = document.getElementById('impact');
  if (impactSection) {
    observer.observe(impactSection);
  }

  // Tab Switching Logic
  const tabLinks = document.querySelectorAll('a[data-target]');
  const pageSections = document.querySelectorAll('.page-section');

  const switchTab = (targetId) => {
    // Hide all sections
    pageSections.forEach(section => {
      section.classList.add('hidden');
    });

    // Show sections matching the target
    const targetSections = document.querySelectorAll(`.page-section[data-page="${targetId}"]`);
    targetSections.forEach(section => {
      section.classList.remove('hidden');
    });

    // Update active state in nav
    document.querySelectorAll('.nav-link[data-target]').forEach(link => {
      if (link.getAttribute('data-target') === targetId) {
        link.classList.add('font-bold', 'text-sq-green');
      } else {
        link.classList.remove('font-bold', 'text-sq-green');
      }
    });

    // Re-trigger counter animation if impact section is shown
    if (targetId === 'impact' && impactSection) {
      observer.observe(impactSection);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-target');
      switchTab(target);
      // Update URL hash without jumping
      history.pushState(null, null, `#${target}`);
    });
  });

  // Handle initial load with direct links (e.g. #events)
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const validTabs = Array.from(tabLinks).map(link => link.getAttribute('data-target'));
    if (validTabs.includes(hash)) {
      switchTab(hash);
    }
  }
});

