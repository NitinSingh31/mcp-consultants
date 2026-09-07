/**
 * MCP CONSULTANTS - Main Global Script
 * Manages sticky navigation, mobile side menu drawer, and global UI events
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  highlightActiveNav();
});

/**
 * Sticky Header Scroll Effect
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile Drawer Menu (uc-side-menu functionality)
 */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger-toggle');
  const sideMenu = document.querySelector('.mobile-side-menu');
  const overlay = document.querySelector('.mobile-side-menu-overlay');
  const closeBtn = document.querySelector('.close-side-menu');

  if (!hamburger || !sideMenu || !overlay) return;

  function openMenu() {
    sideMenu.classList.add('active');
    overlay.classList.add('active');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    sideMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('menu-open');
  }

  hamburger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  // Mobile Accordion Dropdowns
  const parentLinks = document.querySelectorAll('.mobile-nav-link.has-sub');
  parentLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const parentItem = link.closest('.mobile-nav-item');
      if (parentItem) {
        parentItem.classList.toggle('open');
      }
    });
  });
}

/**
 * Highlight Active Navigation Links
 */
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-item a, .mobile-nav-link, .mobile-sub-item a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      // If it's a dropdown child, also highlight the parent
      const parentNavItem = link.closest('.nav-item');
      if (parentNavItem) {
        const topLink = parentNavItem.querySelector('.nav-link');
        if (topLink) topLink.classList.add('active');
      }
    }
  });
}
